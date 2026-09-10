import { NewsletterPanel, type NewsletterPost } from '@/components/admin/newsletter-panel';
import { listPosts } from '@/lib/domains/posts/service';
import { countConfirmed } from '@/lib/domains/subscribers/service';

export default async function AdminNewsletterPage() {
  const [{ posts }, confirmed] = await Promise.all([
    listPosts({ status: 'published', limit: 200 }),
    countConfirmed(),
  ]);

  const options: NewsletterPost[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    sentAt: p.newsletterSentAt ? new Date(p.newsletterSentAt).toISOString() : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Newsletter</h1>
        <p className="text-sm text-muted-foreground">
          {confirmed} confirmed {confirmed === 1 ? 'subscriber' : 'subscribers'} will receive a send.
        </p>
      </div>
      <NewsletterPanel posts={options} confirmedCount={confirmed} />
    </div>
  );
}
