import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotex Cloud Platform - Modern Cloud Solutions',
  description: 'Revolutionary cloud platform for modern businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-[#002040] via-[#003060] to-[#001830]">
          {children}
        </div>
      </body>
    </html>
  );
}