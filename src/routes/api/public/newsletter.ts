import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

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
          return Response.json({ success: true })
        } catch (err) {
          console.error('newsletter: Shopify request failed', err)
          return Response.json({ error: 'Netværksfejl — prøv igen om lidt' }, { status: 502 })
        }
      },
    },
  },
})
