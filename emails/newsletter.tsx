import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface NewsletterEmailProps {
  postTitle: string
  postExcerpt: string
  postUrl: string
  unsubscribeUrl: string
  postImage?: string
  authorName?: string
  authorImageUrl?: string
  siteUrl?: string
}

export function NewsletterEmail({
  postTitle,
  postExcerpt,
  postUrl,
  unsubscribeUrl,
  postImage,
  authorName,
  authorImageUrl,
  siteUrl = "http://localhost:3000",
}: NewsletterEmailProps) {
  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`
  const bookmarkUrl = `${siteUrl}/bookmarks`

  return (
    <Html>
      <Head />
      <Preview>{postTitle} — {postExcerpt.slice(0, 90)}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerLabel}>NEW POST</Text>
          </Section>

          {/* Cover image */}
          {postImage && (
            <Section style={{ padding: 0 }}>
              <Img
                src={postImage}
                alt={postTitle}
                width="600"
                style={coverImage}
              />
            </Section>
          )}

          {/* Content */}
          <Section style={content}>
            <Text style={title}>{postTitle}</Text>
            <Text style={excerpt}>{postExcerpt}</Text>

            {/* Author row */}
            {authorName && (
              <Section style={authorRow}>
                {authorImageUrl && (
                  <Img
                    src={authorImageUrl}
                    alt={authorName}
                    width="24"
                    height="24"
                    style={authorAvatar}
                  />
                )}
                <Text style={authorText}>{authorName}</Text>
              </Section>
            )}

            {/* CTA buttons */}
            <Section style={buttonRow}>
              <Button href={postUrl} style={primaryButton}>
                Read the Post →
              </Button>
            </Section>

            <Section style={secondaryButtonRow}>
              <Button href={bookmarkUrl} style={secondaryButton}>
                Save for Later →
              </Button>
              <Link href={shareUrl} style={shareLink}>
                Share on X ↗
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footerSection}>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to the blog newsletter.{" "}
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
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

const coverImage: React.CSSProperties = {
  display: "block",
  maxHeight: "280px",
  objectFit: "cover",
  width: "100%",
}

const content: React.CSSProperties = {
  padding: "32px 32px 24px",
}

const title: React.CSSProperties = {
  color: "#0a0a0a",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 12px",
}

const excerpt: React.CSSProperties = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "1.65",
  margin: "0 0 24px",
}

const authorRow: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  marginBottom: "24px",
}

const authorAvatar: React.CSSProperties = {
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "8px",
  verticalAlign: "middle",
}

const authorText: React.CSSProperties = {
  color: "#737373",
  display: "inline-block",
  fontSize: "13px",
  margin: 0,
  verticalAlign: "middle",
}

const buttonRow: React.CSSProperties = {
  marginBottom: "12px",
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

const secondaryButtonRow: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  gap: "16px",
  marginBottom: "8px",
}

const secondaryButton: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  border: "1px solid #e5e5e5",
  borderRadius: "6px",
  color: "#0a0a0a",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "500",
  padding: "10px 20px",
  textDecoration: "none",
}

const shareLink: React.CSSProperties = {
  color: "#737373",
  fontSize: "14px",
  textDecoration: "underline",
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

const footerLink: React.CSSProperties = {
  color: "#a3a3a3",
}
