import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold text-white transition-colors hover:text-blue-400"
            >
              Blog
            </Link>
            <p className="mt-4 max-w-md text-gray-400">
              A modern blog built with Next.js, React, and Tailwind CSS. Sharing thoughts,
              tutorials, and insights about web development and technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Drakeze"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/not_blackkid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/anthony-shead-3a2a3424b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">© {currentYear} Blog. All rights reserved.</p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
