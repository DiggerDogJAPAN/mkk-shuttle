import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ComingSoonGate } from "@/components/layout/coming-soon-gate";

import { generateSeoMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { getOrganizationSchema } from '@/lib/schema';

export const metadata: Metadata = {
  ...generateSeoMetadata(),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
        {/* Placeholder for future SessionProvider/AuthProvider wrapping */}
        <Header />
        <main className="flex-1 flex flex-col">
          <ComingSoonGate>
            {children}
          </ComingSoonGate>
        </main>
        <Footer />
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
      </body>

    </html>
  );
}
