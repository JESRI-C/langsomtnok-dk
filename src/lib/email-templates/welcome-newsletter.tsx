import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Link,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'Langsomt Nok'
const SITE_URL = 'https://langsomtnok.dk'

interface WelcomeNewsletterProps {
  firstName?: string
}

const WelcomeNewsletterEmail = ({ firstName = '' }: WelcomeNewsletterProps) => (
  <Html lang="da" dir="ltr">
    <Head />
    <Preview>Velkommen til Langsomt Brev — ro, håndværk og køkkenritualer.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Velkommen til Langsomt Brev</Heading>
        <Text style={lede}>
          {firstName ? `Kære ${firstName},` : 'Kære læser,'} tak fordi du sagde ja til et roligere øjeblik i indbakken.
        </Text>

        <Text style={p}>
          Vi skriver kun, når vi har noget vi selv gad læse — rolige guides om knive, keramik og pleje, en ny fortælling fra værkstedet, eller et ritual, der gør det næste måltid en anelse bedre.
        </Text>

        <Section style={card}>
          <Heading style={h2}>Måske vil du gerne begynde her</Heading>
          <Text style={cardItem}>
            <Link href={`${SITE_URL}/guides/hvilken-kokkekniv-skal-jeg-vaelge`} style={link}>
              → Hvilken kokkekniv skal jeg vælge?
            </Link>
          </Text>
          <Text style={cardItem}>
            <Link href={`${SITE_URL}/guides/hvordan-sliber-man-en-kniv`} style={link}>
              → Sådan sliber du din kniv — roligt
            </Link>
          </Text>
          <Text style={cardItem}>
            <Link href={`${SITE_URL}/universet`} style={link}>
              → Universet: fortællinger fra det langsomme køkken
            </Link>
          </Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Med rolig hilsen<br />
          {SITE_NAME}
        </Text>
        <Text style={smallFooter}>
          Du modtager denne mail, fordi du har tilmeldt dig Langsomt Brev på langsomtnok.dk.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeNewsletterEmail,
  subject: () => 'Velkommen til Langsomt Brev',
  displayName: 'Nyhedsbrev — velkomstmail',
  previewData: { firstName: 'Anna' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 16px', fontFamily: 'Playfair Display, Georgia, serif' }
const h2 = { fontSize: '15px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 12px', fontFamily: 'Playfair Display, Georgia, serif' }
const lede = { fontSize: '15px', color: '#5A3B2E', lineHeight: '1.6', margin: '0 0 16px' }
const p = { fontSize: '14px', color: '#2D2D2D', lineHeight: '1.7', margin: '0 0 24px' }
const card = { backgroundColor: '#F8F6F3', borderRadius: '10px', padding: '20px 22px', margin: '0 0 24px' }
const cardItem = { fontSize: '14px', margin: '0 0 8px', lineHeight: '1.5' }
const link = { color: '#4C574A', textDecoration: 'none' }
const hr = { borderColor: '#E6E0D7', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#5A3B2E', margin: '12px 0 8px', lineHeight: '1.6' }
const smallFooter = { fontSize: '11px', color: '#999999', margin: '16px 0 0', lineHeight: '1.5' }
