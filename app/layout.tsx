import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Line Atlas | Astrophysical Spectroscopy Field Guide',
  description: 'An interactive reference for astrophysical spectral lines and the multiphase universe.',
  authors: [{ name: 'Tanmay Singh' }],
  creator: 'Tanmay Singh',
  openGraph: {
    type: 'website',
    title: 'Line Atlas',
    description: 'A field guide to astrophysical spectroscopy, from radio through gamma rays.',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Line Atlas: A Field Guide to Astrophysical Spectroscopy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Line Atlas',
    description: 'A field guide to astrophysical spectroscopy, from radio through gamma rays.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
