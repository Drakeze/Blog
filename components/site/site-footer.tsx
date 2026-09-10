import { site, socialLinks } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 font-mono text-[0.72rem] text-faint">
      <span>© {new Date().getFullYear()} {site.author}</span>
      <div className="flex flex-wrap gap-4">
        <a
          href={site.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary transition-colors hover:opacity-80"
        >
          Portfolio ↗
        </a>
        {socialLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {s.label}
          </a>
        ))}
        <a href="/feed.xml" className="text-muted-foreground transition-colors hover:text-primary">
          RSS
        </a>
      </div>
    </footer>
  );
}
