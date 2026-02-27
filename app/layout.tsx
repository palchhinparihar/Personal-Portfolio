import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Palchhin | Personal Portfolio',
  description:
    'Hi, Palchhin here~ Welcome to my personal portfolio. Explore my work, projects, and connect with me.',
  keywords: ['Palchhin', 'portfolio', 'developer', 'web development', 'personal website'],
  authors: [{ name: 'Palchhin' }],
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'Palchhin | Personal Portfolio',
    description:
      'Hi, Palchhin here~ Welcome to my personal portfolio.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palchhin | Personal Portfolio',
    description:
      'Hi, Palchhin here~ Welcome to my personal portfolio.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#050810',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
