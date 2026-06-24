import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

const SOCIAL_LINKS = {
  x: "https://x.com/SorenIdeas",
  github: "https://github.com/Drakeze",
  linkedin: "https://www.linkedin.com/in/anthonyshead/",
  reddit: "https://www.reddit.com/user/Putrid-Economy1639/",
}

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
}: NewsletterEmailProps) {
  const xShareUrl = `https://x.com/intent/post?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`

  return (
    <Html>
      <Head />
      <Preview>
        {postTitle} — {postExcerpt.slice(0, 90)}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {postImage && (
            <Img
              src={postImage}
              alt={postTitle}
              width="600"
              style={heroImage}
            />
          )}

          <Section style={content}>
            <Text style={titleStyle}>{postTitle}</Text>
            <Text style={excerptStyle}>{postExcerpt}</Text>
          </Section>

          <Hr style={divider} />

          {/* Author + Read CTA */}
          <Section style={authorSection}>
            <Row>
              <Column style={authorCol}>
                {authorName && (
                  <>
                    {authorImageUrl && (
                      <Img
                        src={authorImageUrl}
                        alt={authorName}
                        width="36"
                        height="36"
                        style={avatarStyle}
                      />
                    )}
                    <span style={authorNameStyle}>{authorName}</span>
                  </>
                )}
              </Column>
              <Column style={ctaCol}>
                <Button href={postUrl} style={primaryButton}>
                  Read the Full Post →
                </Button>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Share this post */}
          <Section style={socialSection}>
            <Text style={socialLabel}>Share this post</Text>
            <Row>
              <Column>
                <Link href={xShareUrl} style={sharePillStyle}>
                  Share on X ↗
                </Link>
              </Column>
              <Column>
                <Link href={linkedInShareUrl} style={sharePillStyle}>
                  Share on LinkedIn ↗
                </Link>
              </Column>
            </Row>
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
              You&apos;re receiving this because you subscribed to the blog
              newsletter.{" "}
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

const heroImage: React.CSSProperties = {
  borderRadius: "8px 8px 0 0",
  display: "block",
  maxHeight: "300px",
  objectFit: "cover",
  width: "100%",
}

const content: React.CSSProperties = {
  padding: "32px 32px 24px",
}

const titleStyle: React.CSSProperties = {
  color: "#0a0a0a",
  fontSize: "26px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 16px",
}

const excerptStyle: React.CSSProperties = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "1.7",
  margin: 0,
}

const divider: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e5e5e5",
  margin: "0 32px",
}

const authorSection: React.CSSProperties = {
  padding: "20px 32px",
}

const authorCol: React.CSSProperties = {
  verticalAlign: "middle",
}

const ctaCol: React.CSSProperties = {
  textAlign: "right",
  verticalAlign: "middle",
}

const avatarStyle: React.CSSProperties = {
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "10px",
  verticalAlign: "middle",
}

const authorNameStyle: React.CSSProperties = {
  color: "#525252",
  fontSize: "14px",
  verticalAlign: "middle",
}

const primaryButton: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "11px 22px",
  textDecoration: "none",
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

const sharePillStyle: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  border: "1px solid #e5e5e5",
  borderRadius: "6px",
  color: "#0a0a0a",
  display: "inline-block",
  fontSize: "13px",
  fontWeight: "500",
  padding: "8px 16px",
  textDecoration: "none",
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

const footerLink: React.CSSProperties = {
  color: "#a3a3a3",
}
