import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatBot } from '@/components/chatbot/ChatBot';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: 'LumaShift – Cybersecurity Career Coaching',
    template: '%s | LumaShift',
  },
  description:
    'Expert cybersecurity career coaching for Malaysian and global professionals. Resume reviews, mock interviews, career consultations, and specialist coaching tracks.',
  keywords: [
    'cybersecurity career coaching',
    'cybersecurity jobs Malaysia',
    'security analyst career',
    'GRC career coaching',
    'cloud security career',
    'SOC analyst coaching',
    'cybersecurity resume Malaysia',
    'IT security career Malaysia',
  ],
  authors: [{ name: 'LumaShift' }],
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://lumashift.com',
    siteName: 'LumaShift',
    title: 'LumaShift – Cybersecurity Career Coaching',
    description:
      'Expert cybersecurity career coaching for Malaysian and global professionals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LumaShift – Cybersecurity Career Coaching',
    description:
      'Expert cybersecurity career coaching for Malaysian and global professionals.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
