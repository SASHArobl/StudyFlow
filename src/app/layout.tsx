import type { Metadata } from 'next';
import { themeInitializationScript } from '@/lib/theme';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';

const inter = localFont({
  src: '../assets/fonts/InterVariable.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudyFlow',
  description: 'Study planning and learning progress.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
