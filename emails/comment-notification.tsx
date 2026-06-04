import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface CommentNotificationEmailProps {
  replierDisplayName: string
  postTitle: string
  postUrl: string
  replyContent: string
  originalContent: string
  commentId: string
}

export function CommentNotificationEmail({
  replierDisplayName,
  postTitle,
  postUrl,
  replyContent,
  originalContent,
  commentId,
}: CommentNotificationEmailProps) {
  const conversationUrl = `${postUrl}#comment-${commentId}`
  const truncatedOriginal =
    originalContent.length > 200
      ? originalContent.slice(0, 200) + "…"
      : originalContent

  return (
    <Html>
      <Head />
      <Preview>
        {replierDisplayName} replied to your comment on &quot;{postTitle}&quot;
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerLabel}>NEW REPLY</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={heading}>Someone replied to your comment</Text>
            <Text style={subheading}>
              <strong>{replierDisplayName}</strong> replied on &quot;{postTitle}&quot;
            </Text>

            {/* Original comment quoted */}
            <Text style={quoteLabel}>Your comment:</Text>
            <Section style={quotedBlock}>
              <Text style={quotedText}>{truncatedOriginal}</Text>
            </Section>

            {/* Reply */}
            <Text style={replyLabel}>{replierDisplayName} wrote:</Text>
            <Text style={replyText}>{replyContent}</Text>

            {/* CTA */}
            <Section style={buttonRow}>
              <Button href={conversationUrl} style={primaryButton}>
                View the conversation →
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footerSection}>
            <Text style={footerText}>
              You received this because someone replied to your comment on the blog.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const body: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily: "system-ui, -apple-system, sans-serif",
  margin: 0,
  padding: "32px 0",
}

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
  overflow: "hidden",
}

const header: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  padding: "20px 32px",
}

const headerLabel: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  margin: 0,
  textTransform: "uppercase",
}

const content: React.CSSProperties = {
  padding: "32px 32px 24px",
}

const heading: React.CSSProperties = {
  color: "#0a0a0a",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0 0 8px",
}

const subheading: React.CSSProperties = {
  color: "#525252",
  fontSize: "15px",
  margin: "0 0 28px",
}

const quoteLabel: React.CSSProperties = {
  color: "#737373",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.05em",
  margin: "0 0 8px",
  textTransform: "uppercase",
}

const quotedBlock: React.CSSProperties = {
  backgroundColor: "#f9f9f9",
  borderLeft: "3px solid #e5e5e5",
  borderRadius: "0 4px 4px 0",
  marginBottom: "24px",
  padding: "12px 16px",
}

const quotedText: React.CSSProperties = {
  color: "#737373",
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "1.6",
  margin: 0,
}

const replyLabel: React.CSSProperties = {
  color: "#737373",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.05em",
  margin: "0 0 8px",
  textTransform: "uppercase",
}

const replyText: React.CSSProperties = {
  color: "#0a0a0a",
  fontSize: "15px",
  lineHeight: "1.65",
  margin: "0 0 28px",
}

const buttonRow: React.CSSProperties = {
  marginBottom: "8px",
}

const primaryButton: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
}

const divider: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e5e5e5",
  margin: "0 32px",
}

const footerSection: React.CSSProperties = {
  padding: "20px 32px 28px",
}

const footerText: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "12px",
  margin: 0,
}
