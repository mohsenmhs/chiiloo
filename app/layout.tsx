import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  title: 'چیلو - فروشگاه زعفران ممتاز',
  description: 'کشف بهترین کیفیت زعفران از چیلو. محصولات زعفران ممتاز با طعم و عطر اصیل.',
  keywords: 'زعفران, زعفران ممتاز, ادویه, چیلو, زعفران با کیفیت',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'چیلو - فروشگاه زعفران ممتاز',
    description: 'کشف بهترین کیفیت زعفران از چیلو',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <CartProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

