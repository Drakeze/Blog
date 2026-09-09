import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConfirmSubscriptionEmailProps {
  confirmUrl: string;
  siteUrl?: string;
}

export function ConfirmSubscriptionEmail({
  confirmUrl,
  siteUrl = 'http://localhost:3000',
}: ConfirmSubscriptionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to Thinking Out Loud</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerLabel}>ONE MORE STEP</Text>
          </Section>

          <Section style={content}>
            <Text style={title}>Confirm your subscription</Text>
            <Text style={paragraph}>
              Tap the button below to confirm your email and start receiving new posts from Thinking
              Out Loud. If you didn&apos;t request this, you can ignore this email — nothing will be
              sent until you confirm.
            </Text>

            <Section style={buttonRow}>
              <Button href={confirmUrl} style={primaryButton}>
                Confirm subscription →
              </Button>
            </Section>

            <Text style={fallback}>
              Or paste this link into your browser:
              <br />
              <Link href={confirmUrl} style={fallbackLink}>
                {confirmUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />
          <Section style={footerSection}>
            <Text style={footerText}>
              Sent by{' '}
              <Link href={siteUrl} style={footerLink}>
                Thinking Out Loud
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  margin: 0,
  padding: '32px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '0 auto',
  overflow: 'hidden',
};

const header: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  padding: '20px 32px',
};

const headerLabel: React.CSSProperties = {
  color: '#a3a3a3',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  margin: 0,
  textTransform: 'uppercase',
};

const content: React.CSSProperties = {
  padding: '32px 32px 24px',
};

const title: React.CSSProperties = {
  color: '#0a0a0a',
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 12px',
};

const paragraph: React.CSSProperties = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '1.65',
  margin: '0 0 24px',
};

const buttonRow: React.CSSProperties = {
  marginBottom: '24px',
};

const primaryButton: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
};

const fallback: React.CSSProperties = {
  color: '#a3a3a3',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: 0,
};

const fallbackLink: React.CSSProperties = {
  color: '#737373',
  wordBreak: 'break-all',
};

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #e5e5e5',
  margin: '0 32px',
};

const footerSection: React.CSSProperties = {
  padding: '20px 32px 28px',
};

const footerText: React.CSSProperties = {
  color: '#a3a3a3',
  fontSize: '12px',
  margin: 0,
};

const footerLink: React.CSSProperties = {
  color: '#a3a3a3',
};
