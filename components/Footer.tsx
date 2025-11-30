import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Chiiloo</h3>
            <p className={styles.footerText}>
              Premium quality saffron for the finest culinary experiences.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about/">About</Link></li>
              <li><Link href="/products/">Products</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Contact</h4>
            <p className={styles.footerText}>
              Email: info@chiiloo.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Chiiloo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

