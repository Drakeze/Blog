'use client';

import Link from 'next/link';
import { useState } from 'react';

import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-neutral-50"
            >
              What The Post?!
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-neutral-200"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-neutral-200"
            >
              About
            </Link>
            <Link
              href="/contact?subject=Hello"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-neutral-200"
            >
              Contact
            </Link>
            <DarkModeToggle />
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <DarkModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:text-blue-600 focus:outline-none dark:text-neutral-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 border-t border-gray-200 px-2 pt-2 pb-3 sm:px-3 dark:border-neutral-800">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-neutral-100"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-neutral-100"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-neutral-100"
              >
                About
              </Link>
              <Link
                href="/contact?subject=Hello"
                className="block px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-neutral-100"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
