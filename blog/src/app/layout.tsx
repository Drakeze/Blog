import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Modern Blog - Soren Technologies",
  description: "A modern blog built with Next.js, React, and Tailwind CSS. Sharing insights about web development and technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
