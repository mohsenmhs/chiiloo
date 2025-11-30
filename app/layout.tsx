import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Chiiloo - Premium Saffron Shop',
  description: 'Discover the finest quality saffron from Chiiloo. Premium saffron products with authentic flavor and aroma.',
  keywords: 'saffron, premium saffron, spice, Chiiloo, quality saffron',
  openGraph: {
    title: 'Chiiloo - Premium Saffron Shop',
    description: 'Discover the finest quality saffron from Chiiloo',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

