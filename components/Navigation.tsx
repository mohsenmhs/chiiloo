'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './Navigation.module.css'

// Import logo directly - Next.js webpack will handle this
import logoImage from '@/assets/img/logo.png'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWinking, setIsWinking] = useState(false)
  const { getTotalItems } = useCart()
  const cartItemsCount = getTotalItems()
  const prevCartCountRef = useRef(cartItemsCount)

  // Trigger winking animation when cart items increase
  useEffect(() => {
    if (cartItemsCount > prevCartCountRef.current) {
      setIsWinking(true)
      const timer = setTimeout(() => {
        setIsWinking(false)
      }, 1000) // Animation duration
      return () => clearTimeout(timer)
    }
    prevCartCountRef.current = cartItemsCount
  }, [cartItemsCount])

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image 
            src={logoImage}
            alt="چیلو - زعفران ممتاز" 
            width={120}
            height={60}
            className={styles.logoImage}
            unoptimized
            priority
          />
        </Link>
        
        <button 
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="منو"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <li><Link href="/" onClick={() => setIsMenuOpen(false)}>خانه</Link></li>
          <li><Link href="/about/" onClick={() => setIsMenuOpen(false)}>درباره ما</Link></li>
          <li><Link href="/products/" onClick={() => setIsMenuOpen(false)}>محصولات</Link></li>
          <li>
            <Link 
              href="/cart/" 
              onClick={() => setIsMenuOpen(false)} 
              className={`${styles.cartLink} ${isWinking ? styles.cartWink : ''}`}
            >
              <span>سبد خرید</span>
              {cartItemsCount > 0 && (
                <span className={`${styles.cartBadge} ${isWinking ? styles.badgePulse : ''}`}>
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

