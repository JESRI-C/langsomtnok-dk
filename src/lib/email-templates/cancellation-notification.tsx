import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'Langsomt Nok'

interface CancellationNotificationProps {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  orderNumber?: string
  orderDate?: string
  receivedDate?: string
  reason?: string
  submittedAt?: string
  referenceId?: string
}

const CancellationNotificationEmail = ({
  fullName = '(uoplyst)',
  email = '(uoplyst)',
  phone = '',
  address = '',
  orderNumber = '',
  orderDate = '',
  receivedDate = '',
  reason = '',
  submittedAt = '',
  referenceId = '',
}: CancellationNotificationProps) => (
  <Html lang="da" dir="ltr">
    <Head />
    <Preview>Ny fortrydelse — {fullName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ny fortrydelse modtaget</Heading>
        <Text style={lede}>
          En kunde har udfyldt standardfortrydelsesformularen på {SITE_NAME}.
        </Text>

        <Section style={card}>
          <Text style={label}>Navn</Text>
          <Text style={value}>{fullName}</Text>

          <Text style={label}>E-mail</Text>
          <Text style={value}>{email}</Text>

          {phone ? (<><Text style={label}>Telefon</Text><Text style={value}>{phone}</Text></>) : null}
          {address ? (<><Text style={label}>Adresse</Text><Text style={value}>{address}</Text></>) : null}
          {orderNumber ? (<><Text style={label}>Ordrenummer</Text><Text style={value}>{orderNumber}</Text></>) : null}
          {orderDate ? (<><Text style={label}>Bestillingsdato</Text><Text style={value}>{orderDate}</Text></>) : null}
          {receivedDate ? (<><Text style={label}>Modtaget varen</Text><Text style={value}>{receivedDate}</Text></>) : null}
          {submittedAt ? (<><Text style={label}>Indsendt</Text><Text style={value}>{submittedAt}</Text></>) : null}
          {referenceId ? (<><Text style={label}>Reference</Text><Text style={value}>{referenceId}</Text></>) : null}
        </Section>

        {reason ? (
          <>
            <Hr style={hr} />
            <Text style={label}>Årsag (valgfri)</Text>
            <Text style={messageStyle}>{reason}</Text>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Bekræftelse er sendt til kundens e-mail. Husk at tilbagebetale senest 14 dage efter modtagelse.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: CancellationNotificationEmail,
  subject: (data: Record<string, any>) =>
    `Ny fortrydelse: ${data?.fullName || 'kunde'}${data?.orderNumber ? ` (${data.orderNumber})` : ''}`,
  to: 'hej@langsomtnok.dk',
  displayName: 'Fortrydelse — notifikation til shop',
  previewData: {
    fullName: 'Anna Hansen',
    email: 'anna@example.com',
    phone: '+45 12 34 56 78',
    address: 'Vesterbrogade 1, 1620 København V',
    orderNumber: '#1042',
    orderDate: '01-07-2026',
    receivedDate: '03-07-2026',
    reason: 'Jeg fandt en anden model, der passer bedre.',
    submittedAt: new Date().toISOString(),
    referenceId: 'abc123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 12px', fontFamily: 'Playfair Display, Georgia, serif' }
const lede = { fontSize: '14px', color: '#5A3B2E', lineHeight: '1.5', margin: '0 0 24px' }
const card = { backgroundColor: '#F8F6F3', borderRadius: '10px', padding: '18px 20px', margin: '0 0 8px' }
const label = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#5A3B2E', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#2D2D2D', margin: '0 0 4px', lineHeight: '1.5' }
const messageStyle = { fontSize: '14px', color: '#2D2D2D', whiteSpace: 'pre-wrap' as const, lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#E6E0D7', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '12px 0 0' }
