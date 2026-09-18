import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import AppWrapper from './components/AppWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: '邵歆晔｜AI 产品、内容运营与设计作品集',
  description: '邵歆晔的 2026 秋招个人作品集：AI 产品、内容运营、用户体验与视觉设计。',
  openGraph: {
    title: '邵歆晔 · SHAO XINYE｜Portfolio 2026',
    description: 'AI Product · Content Operations · Design',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '邵歆晔 2026 作品集' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '邵歆晔 · SHAO XINYE｜Portfolio 2026',
    description: 'AI Product · Content Operations · Design',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
