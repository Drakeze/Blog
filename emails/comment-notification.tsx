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
} from "@react-email/components"

const SOCIAL_LINKS = {
  x: "https://x.com/SorenIdeas",
  github: "https://github.com/Drakeze",
  linkedin: "https://www.linkedin.com/in/anthonyshead/",
  reddit: "https://www.reddit.com/user/Putrid-Economy1639/",
}

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
          <Section style={content}>
            <Text style={label}>New Reply</Text>
            <Text style={heading}>
              {replierDisplayName} replied to your comment
            </Text>
            <Text style={subtext}>
              on{" "}
              <Link href={postUrl} style={postLink}>
                &quot;{postTitle}&quot;
              </Link>
            </Text>

            <Text style={quoteLabel}>Your comment</Text>
            <Section style={quotedBlock}>
              <Text style={quotedText}>{truncatedOriginal}</Text>
            </Section>

            <Text style={replyLabel}>{replierDisplayName} says</Text>
            <Text style={replyText}>{replyContent}</Text>

            <Section style={buttonRow}>
              <Button href={conversationUrl} style={primaryButton}>
                View the conversation →
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Follow me */}
          <Section style={socialSection}>
            <Text style={socialLabel}>Follow me</Text>
            <Text style={followRowStyle}>
              <Link href={SOCIAL_LINKS.x} style={followLink}>
                X (Twitter)
              </Link>
              {" · "}
              <Link href={SOCIAL_LINKS.github} style={followLink}>
                GitHub
              </Link>
              {" · "}
              <Link href={SOCIAL_LINKS.linkedin} style={followLink}>
                LinkedIn
              </Link>
              {" · "}
              <Link href={SOCIAL_LINKS.reddit} style={followLink}>
                Reddit
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footerSection}>
            <Text style={footerText}>
              You received this because someone replied to your comment on the
              blog.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

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

const content: React.CSSProperties = {
  padding: "32px 32px 24px",
}

const label: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  border: "1px solid #e5e5e5",
  borderRadius: "4px",
  color: "#525252",
  display: "inline-block",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  margin: "0 0 20px",
  padding: "3px 10px",
  textTransform: "uppercase",
}

const heading: React.CSSProperties = {
  color: "#0a0a0a",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 8px",
}

const subtext: React.CSSProperties = {
  color: "#737373",
  fontSize: "15px",
  margin: "0 0 28px",
}

const postLink: React.CSSProperties = {
  color: "#525252",
  textDecoration: "underline",
}

const quoteLabel: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.08em",
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
  color: "#a3a3a3",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.08em",
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

const socialSection: React.CSSProperties = {
  padding: "20px 32px",
}

const socialLabel: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  margin: "0 0 12px",
  textTransform: "uppercase",
}

const followRowStyle: React.CSSProperties = {
  color: "#737373",
  fontSize: "14px",
  margin: 0,
}

const followLink: React.CSSProperties = {
  color: "#525252",
  textDecoration: "none",
}

const footerSection: React.CSSProperties = {
  padding: "20px 32px 28px",
}

const footerText: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "12px",
  margin: 0,
}
