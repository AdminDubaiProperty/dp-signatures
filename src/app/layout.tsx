import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Email Signature Generator | Dubai-Property.nl',
  description: 'Generate professional email signatures for the Dubai-Property.nl team',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1C1A17] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
