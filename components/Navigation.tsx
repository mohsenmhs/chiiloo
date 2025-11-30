'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './Navigation.module.css'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Chiiloo</span>
          <span className={styles.logoSubtext}>Premium Saffron</span>
        </Link>
        
        <button 
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link href="/about/" onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link href="/products/" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
        </ul>
      </div>
    </nav>
  )
}

