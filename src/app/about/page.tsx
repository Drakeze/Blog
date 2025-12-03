import Link from 'next/link';

export const metadata = {
  title: 'About | Blog',
  description:
    'Learn more about our blog and the team behind it. Discover our mission, values, and passion for sharing knowledge about web development and technology.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">About Our Blog</h1>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
          Welcome to our corner of the web where we share insights, tutorials, and thoughts about
          modern web development, design, and technology.
        </p>
      </div>

      {/* Main Content */}
      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="prose prose-lg max-w-none">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              We believe that knowledge should be accessible to everyone. Our mission is to create
              high-quality, practical content that helps developers at all levels improve their
              skills and stay up-to-date with the latest trends in web development.
            </p>

            <h2 className="mt-12 mb-6 text-3xl font-bold text-gray-900">What We Cover</h2>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-blue-900">Frontend Development</h3>
                <p className="text-blue-700">
                  React, Next.js, TypeScript, and modern CSS frameworks like Tailwind CSS.
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-green-900">Backend Development</h3>
                <p className="text-green-700">
                  Node.js, Express, API design, databases, and server-side best practices.
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-purple-900">Design & UX</h3>
                <p className="text-purple-700">
                  UI/UX principles, responsive design, accessibility, and modern design trends.
                </p>
              </div>

              <div className="rounded-lg bg-orange-50 p-6">
                <h3 className="mb-3 text-xl font-semibold text-orange-900">Tools & Workflow</h3>
                <p className="text-orange-700">
                  Development tools, productivity tips, and workflow optimization.
                </p>
              </div>
            </div>

            <h2 className="mt-12 mb-6 text-3xl font-bold text-gray-900">Our Values</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-500"
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
                <span>
                  <strong>Quality First:</strong> We prioritize depth and accuracy over quantity,
                  ensuring every article provides real value.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-500"
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
                <span>
                  <strong>Practical Focus:</strong> Our tutorials and guides are designed to be
                  immediately applicable to real-world projects.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-500"
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
                <span>
                  <strong>Community Driven:</strong> We listen to our readers and create content
                  based on what the community needs most.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-500"
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
                <span>
                  <strong>Continuous Learning:</strong> Technology evolves rapidly, and we&apos;re
                  committed to staying current and sharing the latest insights.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-gray-50 p-8">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Quick Stats</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-blue-600">50+</div>
                <div className="text-gray-600">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-green-600">10K+</div>
                <div className="text-gray-600">Monthly Readers</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-600">5+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-8">
            <h3 className="mb-4 text-xl font-bold text-blue-900">Stay Connected</h3>
            <p className="mb-6 text-blue-700">
              Follow us for the latest updates and behind-the-scenes content.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 transition-colors hover:text-blue-800">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-blue-600 transition-colors hover:text-blue-800">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-blue-600 transition-colors hover:text-blue-800">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Meet the Team</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gray-300">
              <span className="text-2xl font-bold text-gray-600">AS</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Anthony Shead</h3>
            <p className="mb-4 text-gray-600">Founder & Full-Stack Developer</p>
            <p className="text-sm text-gray-700">
              I’m a passionate full-stack web developer and founder of <strong>SorenLab</strong>,
              where I build modern web applications with Next.js, TypeScript, and Tailwind CSS. I
              love exploring the connection between technology, design, and the human experience.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 rounded-lg bg-blue-600 p-8 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
        <p className="mb-8 text-xl text-blue-100">
          Explore our latest articles and join thousands of developers improving their skills.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/blog"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100"
          >
            Browse Articles
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
