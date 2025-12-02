import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  title: 'چیلو - فروشگاه زعفران ممتاز',
  description: 'کشف بهترین کیفیت زعفران از چیلو. محصولات زعفران ممتاز با طعم و عطر اصیل.',
  keywords: 'زعفران, زعفران ممتاز, ادویه, چیلو, زعفران با کیفیت',
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
        <link rel="icon" href="/favicon.ico" />
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

