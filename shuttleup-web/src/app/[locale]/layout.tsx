import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { ServiceWorkerRegister } from "@/components/sw-register";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShuttleUp - Find the perfect badminton session",
  description: "Join local badminton sessions, find players at your skill, or host your own games with our smart matching and booking platform.",
  manifest: "/manifest.json"
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TooltipProvider>
                <div className="min-h-screen flex flex-col bg-background antialiased">
                  <a href="#main-content" className="skip-to-content">
                    Skip to content
                  </a>
                  <Navbar />
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
                <ServiceWorkerRegister />
              </TooltipProvider>
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
