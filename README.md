# Blog Application

A modern blog application built with Next.js 15, TypeScript, and Tailwind CSS.

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Bun](https://bun.com/package-manager) (package manager)

## Getting Started

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repository-url>
   cd blog
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Run the development server**:
   ```bash
   bun dev
   ```

4. **Open your browser** and navigate to:
   - [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `bun dev` - Starts the development server with Turbopack
- `bun build` - Builds the application for production
- `bun start` - Starts the production server
- `bun lint` - Runs ESLint to check for code issues

## Project Structure

```
blog/
├── src/
│   ├── app/
│   │   ├── about/          # About page
│   │   ├── blog/           # Blog listing and individual posts
│   │   ├── contact/        # Contact page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   └── components/
│       ├── Header.tsx      # Navigation header
│       └── Footer.tsx      # Site footer
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Features

- 📱 Responsive design
- 🔍 Blog search and filtering
- 📄 Dynamic blog post pages
- 📧 Contact form
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Turbopack

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## Development

The application uses Next.js App Router and includes:

- Homepage with hero section and featured posts
- Blog listing page with search and pagination
- Individual blog post pages with dynamic routing
- About and Contact pages
- Responsive navigation and footer

## Deployment

This application can be deployed on platforms like:

- [Vercel](https://vercel.com/) (recommended for Next.js)
- [Netlify](https://netlify.com/)
- [Railway](https://railway.app/)
- Any platform that supports Node.js

For production deployment, run:

```bash
bun build
bun start
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
