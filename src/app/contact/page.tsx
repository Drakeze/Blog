'use client';

import { useSearchParams } from 'next/navigation';
import { type ChangeEvent, type FormEvent, Suspense, useEffect, useState } from 'react';

function ContactPageContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subscribeData, setSubscribeData] = useState({ name: '', email: '', message: '' });
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeSubmitting, setSubscribeSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setFormData((prev) => ({ ...prev, subject: decodeURIComponent(subjectParam) }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (showSubscribe) {
      setSubscribeStatus('idle');
    }
  }, [showSubscribe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Unable to send message. Please try again later.');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubscribeSubmitting(true);
    setSubscribeStatus('idle');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscribeData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Unable to subscribe.');
      }

      setSubscribeStatus('success');
      setSubscribeData({ name: '', email: '', message: '' });
      setTimeout(() => setShowSubscribe(false), 800);
    } catch {
      setSubscribeStatus('error');
    } finally {
      setSubscribeSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-neutral-50">
          Get in Touch
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-neutral-200">
          Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowSubscribe(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Subscribe for updates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Contact Form */}
        <div>
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-neutral-100">
            Send us a message
          </h2>

          {submitStatus === 'success' && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-emerald-700 dark:bg-emerald-900/30">
              <div className="flex">
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-emerald-200">
                    Message sent successfully!
                  </h3>
                  <p className="mt-1 text-sm text-green-700 dark:text-emerald-100">
                    Thank you for reaching out. We&apos;ll get back to you soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
              <div className="flex">
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-100">
                    Error sending message
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-100">
                    Please try again later or contact us directly.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-200"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-200"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-200"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-200"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="resize-vertical w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Other ways to reach us</h2>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                <p className="mt-1 text-gray-600">asheadwork@gmail.com</p>
                <p className="mt-1 text-sm text-gray-700">We typically respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>
                <p className="mt-1 text-gray-600">Follow us for updates and quick questions</p>
                <div className="mt-3 flex space-x-4">
                  <a href="#" className="text-gray-600 transition-colors hover:text-blue-500">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 transition-colors hover:text-blue-700">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 transition-colors hover:text-gray-900">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                <p className="mt-1 text-gray-600">Los Angles, CA</p>
                <p className="mt-1 text-sm text-gray-700">Remote-first team</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h3 className="mb-6 text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-medium text-gray-900">
                  How quickly do you respond to messages?
                </h4>
                <p className="text-sm text-gray-600">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-medium text-gray-900">Do you accept guest posts?</h4>
                <p className="text-sm text-gray-600">
                  Yes! We&apos;re always looking for quality content. Please include your article
                  idea and writing samples.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="mb-2 font-medium text-gray-900">
                  Can you help with technical questions?
                </h4>
                <p className="text-sm text-gray-600">
                  While we can&apos;t provide individual technical support, we encourage you to ask
                  questions that might benefit the community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {showSubscribe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-50">
                    Subscribe for updates
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-300">
                    Stay in the loop with new posts and announcements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubscribe(false)}
                  className="text-gray-500 hover:text-gray-800 dark:text-neutral-300"
                >
                  <span className="sr-only">Close</span>×
                </button>
              </div>

              {subscribeStatus === 'success' && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">
                  Thanks for subscribing! We&apos;ll keep you updated.
                </div>
              )}
              {subscribeStatus === 'error' && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-100">
                  Unable to subscribe right now. Please try again.
                </div>
              )}

              <form onSubmit={handleSubscribeSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-200">
                    Name
                  </label>
                  <input
                    type="text"
                    value={subscribeData.name}
                    onChange={(e) =>
                      setSubscribeData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={subscribeData.email}
                    onChange={(e) =>
                      setSubscribeData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-200">
                    Message (optional)
                  </label>
                  <textarea
                    value={subscribeData.message}
                    onChange={(e) =>
                      setSubscribeData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    placeholder="Topics you care about"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubscribe(false)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={subscribeSubmitting}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
                  >
                    {subscribeSubmitting ? 'Submitting...' : 'Subscribe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-gray-600 dark:text-neutral-300">
          Loading contact form...
        </div>
      }
    >
      <ContactPageContent />
    </Suspense>
  );
}
