import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'Langsomt Nok'

interface CancellationConfirmationProps {
  fullName?: string
  orderNumber?: string
  submittedAt?: string
  referenceId?: string
}

const CancellationConfirmationEmail = ({
  fullName = '',
  orderNumber = '',
  submittedAt = '',
  referenceId = '',
}: CancellationConfirmationProps) => (
  <Html lang="da" dir="ltr">
    <Head />
    <Preview>Vi har modtaget din fortrydelse — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Tak — vi har modtaget din fortrydelse</Heading>
        <Text style={lede}>
          {fullName ? `Kære ${fullName},` : 'Kære kunde,'} vi har modtaget din anmodning om at gøre brug af fortrydelsesretten. Vi vender roligt tilbage inden for én hverdag.
        </Text>

        <Section style={card}>
          {orderNumber ? (
            <>
              <Text style={label}>Ordrenummer</Text>
              <Text style={value}>{orderNumber}</Text>
            </>
          ) : null}
          {submittedAt ? (
            <>
              <Text style={label}>Modtaget</Text>
              <Text style={value}>{submittedAt}</Text>
            </>
          ) : null}
          {referenceId ? (
            <>
              <Text style={label}>Reference</Text>
              <Text style={value}>{referenceId}</Text>
            </>
          ) : null}
        </Section>

        <Hr style={hr} />

        <Heading style={h2}>Sådan gør du nu</Heading>
        <Text style={p}>
          Send varen retur uden unødig forsinkelse og senest 14 dage efter denne besked. Pak den forsvarligt — gerne i den originale emballage.
        </Text>
        <Section style={address}>
          <Text style={addressLabel}>Returadresse</Text>
          <Text style={addressLine}>JBR Freelance</Text>
          <Text style={addressLine}>Bøgevej 4</Text>
          <Text style={addressLine}>7160 Tørring</Text>
          <Text style={addressLine}>Danmark</Text>
        </Section>
        <Text style={p}>
          Så snart varen er retur og godkendt, tilbagebetaler vi købsbeløbet — senest 14 dage efter din besked. Skriv gerne til <span style={mail}>hej@langsomtnok.dk</span> hvis du har spørgsmål undervejs.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          Med rolig hilsen<br />
          {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: CancellationConfirmationEmail,
  subject: () => 'Vi har modtaget din fortrydelse — Langsomt Nok',
  displayName: 'Fortrydelse — bekræftelse til kunde',
  previewData: {
    fullName: 'Anna Hansen',
    orderNumber: '#1042',
    submittedAt: new Date().toLocaleString('da-DK', { dateStyle: 'long', timeStyle: 'short' }),
    referenceId: 'abc123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 12px', fontFamily: 'Playfair Display, Georgia, serif' }
const h2 = { fontSize: '16px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 8px', fontFamily: 'Playfair Display, Georgia, serif' }
const lede = { fontSize: '14px', color: '#5A3B2E', lineHeight: '1.6', margin: '0 0 20px' }
const p = { fontSize: '14px', color: '#2D2D2D', lineHeight: '1.6', margin: '0 0 12px' }
const card = { backgroundColor: '#F8F6F3', borderRadius: '10px', padding: '18px 20px', margin: '0 0 8px' }
const label = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#5A3B2E', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#2D2D2D', margin: '0 0 4px', lineHeight: '1.5' }
const address = { border: '1px solid #E6E0D7', borderRadius: '10px', padding: '14px 18px', margin: '12px 0 20px' }
const addressLabel = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#5A3B2E', margin: '0 0 6px' }
const addressLine = { fontSize: '14px', color: '#2D2D2D', margin: '0', lineHeight: '1.5' }
const hr = { borderColor: '#E6E0D7', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#5A3B2E', margin: '12px 0 0', lineHeight: '1.6' }
const mail = { color: '#4C574A' }
