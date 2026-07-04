import * as React from 'react'
import { render } from '@react-email/components'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Langsomt Nok'
const SENDER_DOMAIN = 'notify.langsomtnok.dk'
const FROM_DOMAIN = 'langsomtnok.dk'
const WELCOME_TEMPLATE = 'welcome-newsletter'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function sendWelcomeEmail(email: string, firstName: string) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) return

  const template = TEMPLATES[WELCOME_TEMPLATE]
  if (!template) return

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalized = email.toLowerCase()

  try {
    // Suppression check
    const { data: suppressed } = await supabase
      .from('suppressed_emails')
      .select('id')
      .eq('email', normalized)
      .maybeSingle()
    if (suppressed) return

    // Get or create unsubscribe token
    let unsubscribeToken = generateToken()
    const { data: existing } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token, used_at')
      .eq('email', normalized)
      .maybeSingle()
    if (existing?.token && !existing?.used_at) {
      unsubscribeToken = existing.token as string
    } else {
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

    const templateData = { firstName }
    const element = React.createElement(template.component, templateData)
    const html = await render(element)
    const text = await render(element, { plainText: true })
    const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject
    const messageId = crypto.randomUUID()

    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: WELCOME_TEMPLATE,
      recipient_email: email,
      status: 'pending',
      metadata: { source: 'newsletter-welcome' },
    })

    await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: messageId,
        to: email,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject,
        html,
        text,
        purpose: 'transactional',
        label: WELCOME_TEMPLATE,
        idempotency_key: `welcome-${normalized}`,
        unsubscribe_token: unsubscribeToken,
        queued_at: new Date().toISOString(),
      },
    })
  } catch (err) {
    console.error('newsletter: welcome email failed', err)
  }
}


// Newsletter signup endpoint — subscribes via Shopify Storefront Customer API.
// No auth required — public endpoint.

const SHOPIFY_API_VERSION = '2025-07'
const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN ?? ''
const SHOPIFY_STOREFRONT_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? ''

const NewsletterSchema = z.object({
  email: z.string().trim().email('Indtast en gyldig e-mailadresse').max(255),
  firstName: z.string().trim().max(100).optional().default(''),
  source: z.string().trim().max(50).optional().default('website'),
  // Honeypot
  website: z.string().max(0).optional().default(''),
})

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email }
      customerUserErrors { field message code }
    }
  }
`

export const Route = createFileRoute('/api/public/newsletter')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
          console.error('newsletter: missing Shopify env')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let parsed: z.infer<typeof NewsletterSchema>
        try {
          const body = await request.json()
          parsed = NewsletterSchema.parse(body)
        } catch (err) {
          const message = err instanceof z.ZodError ? err.issues[0]?.message ?? 'Ugyldige felter' : 'Ugyldig anmodning'
          return Response.json({ error: message }, { status: 400 })
        }

        // Honeypot
        if (parsed.website && parsed.website.length > 0) {
          return Response.json({ success: true })
        }

        const storefrontUrl = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`

        try {
          const res = await fetch(storefrontUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
            },
            body: JSON.stringify({
              query: CUSTOMER_CREATE_MUTATION,
              variables: {
                input: {
                  email: parsed.email,
                  firstName: parsed.firstName || undefined,
                  acceptsMarketing: true,
                },
              },
            }),
          })

          const data = await res.json()
          const userErrors = data?.data?.customerCreate?.customerUserErrors ?? []

          // CUSTOMER_DISABLED = existing customer — treat as success (already subscribed)
          const fatalErrors = userErrors.filter(
            (e: { code: string }) => e.code !== 'CUSTOMER_DISABLED' && e.code !== 'TAKEN',
          )

          if (fatalErrors.length > 0) {
            console.error('newsletter: Shopify userErrors', fatalErrors)
            return Response.json({
              error: 'Tilmelding fejlede — tjek din e-mail og prøv igen',
            }, { status: 422 })
          }

          console.log('newsletter: subscribed', { email: parsed.email.replace(/(.{2}).*@/, '$1***@'), source: parsed.source })

          // Send velkomstmail — fire-and-forget så evt. fejl ikke blokerer response
          sendWelcomeEmail(parsed.email, parsed.firstName).catch(() => {})

          return Response.json({ success: true })
        } catch (err) {
          console.error('newsletter: Shopify request failed', err)
          return Response.json({ error: 'Netværksfejl — prøv igen om lidt' }, { status: 502 })
        }
      },
    },
  },
})
