import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'Langsomt Nok'

interface ContactFormNotificationProps {
  name?: string
  email?: string
  subject?: string
  message?: string
  submittedAt?: string
}

const ContactFormNotificationEmail = ({
  name = '(uoplyst)',
  email = '(uoplyst)',
  subject = '(intet emne)',
  message = '',
  submittedAt,
}: ContactFormNotificationProps) => (
  <Html lang="da" dir="ltr">
    <Head />
    <Preview>Ny besked fra kontaktformularen — {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ny besked fra {SITE_NAME}</Heading>
        <Text style={lede}>
          En kunde har sendt en besked via kontaktformularen på langsomtnok.dk.
        </Text>

        <Section style={card}>
          <Text style={label}>Navn</Text>
          <Text style={value}>{name}</Text>

          <Text style={label}>E-mail</Text>
          <Text style={value}>{email}</Text>

          <Text style={label}>Emne</Text>
          <Text style={value}>{subject}</Text>

          {submittedAt ? (
            <>
              <Text style={label}>Indsendt</Text>
              <Text style={value}>{submittedAt}</Text>
            </>
          ) : null}
        </Section>

        <Hr style={hr} />

        <Text style={label}>Besked</Text>
        <Text style={messageStyle}>{message}</Text>

        <Hr style={hr} />

        <Text style={footer}>
          Svar direkte på denne mail for at kontakte kunden — afsenderadressen er sat
          som svar-til.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactFormNotificationEmail,
  subject: (data: Record<string, any>) =>
    `Ny kontaktbesked: ${data?.subject || 'fra langsomtnok.dk'}`,
  to: 'hej@langsomtnok.dk',
  displayName: 'Kontaktformular — notifikation',
  previewData: {
    name: 'Anna Hansen',
    email: 'anna@example.com',
    subject: 'Spørgsmål om damaskuskniv',
    message: 'Hej, jeg overvejer at købe en damaskuskniv som gave. Kan I anbefale en størrelse?',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 12px', fontFamily: 'Playfair Display, Georgia, serif' }
const lede = { fontSize: '14px', color: '#5A3B2E', lineHeight: '1.5', margin: '0 0 24px' }
const card = { backgroundColor: '#F8F6F3', borderRadius: '10px', padding: '18px 20px', margin: '0 0 8px' }
const label = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#5A3B2E', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#2D2D2D', margin: '0 0 4px', lineHeight: '1.5' }
const messageStyle = { fontSize: '14px', color: '#2D2D2D', whiteSpace: 'pre-wrap' as const, lineHeight: '1.6', margin: '0 0 24px' }
const hr = { borderColor: '#E6E0D7', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '12px 0 0' }
