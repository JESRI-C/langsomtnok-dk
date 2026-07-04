import * as React from 'react'
import { render } from '@react-email/components'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

// Public "fortryd aftale" (right of withdrawal) endpoint — no auth required.
// Saves the request to the DB, sends a confirmation to the customer and a
// notification to the shop owner. Standardfortrydelsesformular per DK consumer law.

const SITE_NAME = 'Langsomt Nok'
const SENDER_DOMAIN = 'notify.langsomtnok.dk'
const FROM_DOMAIN = 'langsomtnok.dk'
const MIN_SUBMIT_MS = 2500

const CancellationSchema = z.object({
  fullName: z.string().trim().min(1, 'Skriv venligst dit fulde navn').max(120),
  address: z.string().trim().max(300).optional().default(''),
  email: z.string().trim().email('Indtast en gyldig e-mailadresse').max(255),
  phone: z.string().trim().max(40).optional().default(''),
  orderNumber: z.string().trim().max(60).optional().default(''),
  orderDate: z.string().trim().max(30).optional().default(''),
  receivedDate: z.string().trim().max(30).optional().default(''),
  reason: z.string().trim().max(2000).optional().default(''),
  consent: z.literal(true, { errorMap: () => ({ message: 'Bekræft venligst fortrydelsen' }) }),
  website: z.string().max(0).optional().default(''), // honeypot
  startedAt: z.number().int().positive(),
})

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function redactEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***'
  return `${local[0]}***@${domain}`
}

async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(ip)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function enqueueEmail(params: {
  supabase: SupabaseClient<any, any, any>
  templateName: string
  recipient: string
  templateData: Record<string, unknown>
  idempotencyKey: string
}) {
  const { supabase, templateName, recipient, templateData, idempotencyKey } = params
  const template = TEMPLATES[templateName]
  if (!template) throw new Error(`Unknown template: ${templateName}`)

  const normalized = recipient.toLowerCase()

  // Suppression check
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', normalized)
    .maybeSingle()
  if (suppressed) {
    console.warn('cancellation: recipient suppressed', { recipient: redactEmail(recipient), templateName })
    return { skipped: true as const }
  }

  // Get or create unsubscribe token
  let unsubscribeToken: string
  const { data: existingToken } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalized)
    .maybeSingle()
  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token as string
  } else {
    unsubscribeToken = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert({ token: unsubscribeToken, email: normalized }, { onConflict: 'email', ignoreDuplicates: true })
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalized)
      .maybeSingle()
    if (stored?.token) unsubscribeToken = stored.token as string
  }

  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject
  const messageId = crypto.randomUUID()

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: recipient,
    status: 'pending',
    metadata: { idempotency_key: idempotencyKey },
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('cancellation: enqueue failed', { error: enqueueError, templateName })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: recipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return { skipped: false as const, error: true as const }
  }
  return { skipped: false as const, error: false as const, messageId }
}

export const Route = createFileRoute('/api/public/cancellation')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
          console.error('cancellation: missing env')
          return Response.json({ error: 'Serverfejl — prøv igen senere' }, { status: 500 })
        }

        let parsed: z.infer<typeof CancellationSchema>
        try {
          const body = await request.json()
          parsed = CancellationSchema.parse(body)
        } catch (err) {
          const message = err instanceof z.ZodError ? err.issues[0]?.message ?? 'Ugyldige felter' : 'Ugyldig anmodning'
          return Response.json({ error: message }, { status: 400 })
        }

        // Honeypot — silent success
        if (parsed.website && parsed.website.length > 0) {
          return Response.json({ success: true })
        }
        if (Date.now() - parsed.startedAt < MIN_SUBMIT_MS) {
          return Response.json({ error: 'Indsendt for hurtigt — prøv igen' }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const ip =
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          ''
        const ipHash = ip ? await hashIp(ip) : null
        const userAgent = request.headers.get('user-agent') || null
        const submittedAt = new Date()
        const submittedAtDisplay = submittedAt.toLocaleString('da-DK', {
          dateStyle: 'long',
          timeStyle: 'short',
          timeZone: 'Europe/Copenhagen',
        })

        // Save request to DB
        const { data: inserted, error: insertError } = await supabase
          .from('cancellation_requests')
          .insert({
            full_name: parsed.fullName,
            address: parsed.address || null,
            email: parsed.email,
            phone: parsed.phone || null,
            order_number: parsed.orderNumber || null,
            order_date: parsed.orderDate ? parsed.orderDate.slice(0, 10) : null,
            received_date: parsed.receivedDate ? parsed.receivedDate.slice(0, 10) : null,
            reason: parsed.reason || null,
            signed_at: submittedAt.toISOString(),
            ip_hash: ipHash,
            user_agent: userAgent,
          })
          .select('id')
          .single()

        if (insertError || !inserted) {
          console.error('cancellation: insert failed', { error: insertError })
          return Response.json({ error: 'Kunne ikke gemme din anmodning — prøv igen om lidt' }, { status: 500 })
        }

        const referenceId = String(inserted.id).slice(0, 8)

        // Send customer confirmation
        await enqueueEmail({
          supabase,
          templateName: 'cancellation-confirmation',
          recipient: parsed.email,
          idempotencyKey: `cancellation-cust-${inserted.id}`,
          templateData: {
            fullName: parsed.fullName,
            orderNumber: parsed.orderNumber || '',
            submittedAt: submittedAtDisplay,
            referenceId,
          },
        })

        // Send shop owner notification
        const notification = TEMPLATES['cancellation-notification']
        const ownerRecipient = notification?.to
        if (ownerRecipient) {
          await enqueueEmail({
            supabase,
            templateName: 'cancellation-notification',
            recipient: ownerRecipient,
            idempotencyKey: `cancellation-owner-${inserted.id}`,
            templateData: {
              fullName: parsed.fullName,
              email: parsed.email,
              phone: parsed.phone || '',
              address: parsed.address || '',
              orderNumber: parsed.orderNumber || '',
              orderDate: parsed.orderDate || '',
              receivedDate: parsed.receivedDate || '',
              reason: parsed.reason || '',
              submittedAt: submittedAtDisplay,
              referenceId,
            },
          })
        }

        console.log('cancellation: received', {
          reference: referenceId,
          customer: redactEmail(parsed.email),
        })

        return Response.json({ success: true, referenceId })
      },
    },
  },
})
