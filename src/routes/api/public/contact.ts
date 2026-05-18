import * as React from 'react'
import { render } from '@react-email/components'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

// Public contact form endpoint — no auth required (visitors are anonymous).
// Spam mitigations: honeypot field + min submit time (2s) + zod validation.

const SITE_NAME = 'Langsomt Nok'
const SENDER_DOMAIN = 'notify.langsomtnok.dk'
const FROM_DOMAIN = 'langsomtnok.dk'
const TEMPLATE_NAME = 'contact-form-notification'
const MIN_SUBMIT_MS = 2000

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Skriv venligst dit navn').max(100),
  email: z.string().trim().email('Indtast en gyldig e-mailadresse').max(255),
  subject: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().min(5, 'Beskeden er for kort').max(5000),
  // Spam mitigations
  website: z.string().max(0).optional().default(''), // honeypot — must be empty
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

export const Route = createFileRoute('/api/public/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
          console.error('contact: missing env')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let parsed: z.infer<typeof ContactSchema>
        try {
          const body = await request.json()
          parsed = ContactSchema.parse(body)
        } catch (err) {
          const message = err instanceof z.ZodError ? err.issues[0]?.message ?? 'Ugyldige felter' : 'Ugyldig anmodning'
          return Response.json({ error: message }, { status: 400 })
        }

        // Honeypot
        if (parsed.website && parsed.website.length > 0) {
          // Pretend success to not tip off bots
          return Response.json({ success: true })
        }

        // Min submit time (anti-bot)
        const elapsed = Date.now() - parsed.startedAt
        if (elapsed < MIN_SUBMIT_MS) {
          return Response.json({ error: 'Indsendt for hurtigt — prøv igen' }, { status: 400 })
        }

        const template = TEMPLATES[TEMPLATE_NAME]
        if (!template || !template.to) {
          console.error('contact: template missing or has no fixed recipient')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const recipient = template.to
        const normalizedRecipient = recipient.toLowerCase()

        // Suppression check (merchant inbox should never be suppressed, but stay fail-closed)
        const { data: suppressed } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', normalizedRecipient)
          .maybeSingle()
        if (suppressed) {
          console.error('contact: merchant inbox is suppressed', { recipient: redactEmail(recipient) })
          return Response.json({ error: 'Kontaktindbakken er midlertidigt utilgængelig' }, { status: 503 })
        }

        // Get or create unsubscribe token for the recipient
        let unsubscribeToken: string
        const { data: existingToken } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token, used_at')
          .eq('email', normalizedRecipient)
          .maybeSingle()
        if (existingToken && !existingToken.used_at) {
          unsubscribeToken = existingToken.token
        } else {
          unsubscribeToken = generateToken()
          await supabase
            .from('email_unsubscribe_tokens')
            .upsert(
              { token: unsubscribeToken, email: normalizedRecipient },
              { onConflict: 'email', ignoreDuplicates: true },
            )
          const { data: stored } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', normalizedRecipient)
            .maybeSingle()
          if (stored?.token) unsubscribeToken = stored.token
        }

        // Render template
        const templateData = {
          name: parsed.name,
          email: parsed.email,
          subject: parsed.subject || '(intet emne)',
          message: parsed.message,
          submittedAt: new Date().toLocaleString('da-DK', {
            dateStyle: 'long',
            timeStyle: 'short',
            timeZone: 'Europe/Copenhagen',
          }),
        }
        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const text = await render(element, { plainText: true })
        const resolvedSubject =
          typeof template.subject === 'function' ? template.subject(templateData) : template.subject

        const messageId = crypto.randomUUID()
        const idempotencyKey = `contact-${messageId}`

        // Log pending
        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: TEMPLATE_NAME,
          recipient_email: recipient,
          status: 'pending',
          metadata: { from_email: parsed.email, from_name: parsed.name },
        })

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: recipient,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject: resolvedSubject,
            html,
            text,
            purpose: 'transactional',
            label: TEMPLATE_NAME,
            idempotency_key: idempotencyKey,
            unsubscribe_token: unsubscribeToken,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          console.error('contact: enqueue failed', { error: enqueueError })
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: TEMPLATE_NAME,
            recipient_email: recipient,
            status: 'failed',
            error_message: 'Failed to enqueue email',
          })
          return Response.json({ error: 'Kunne ikke sende beskeden — prøv igen om lidt' }, { status: 500 })
        }

        console.log('contact: queued', {
          recipient: redactEmail(recipient),
          from: redactEmail(parsed.email),
        })

        return Response.json({ success: true })
      },
    },
  },
})
