import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: '3D Virtual AI Company — AI Employees Office Simulation',
  description:
    'Interactive 3D simulation of an autonomous AI company campus where AI employees work, attend prayer, collaborate, and live in real-time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
