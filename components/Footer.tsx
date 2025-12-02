import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>چیلو</h3>
            <p className={styles.footerText}>
              زعفران با کیفیت ممتاز برای بهترین تجربیات آشپزی.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>لینک‌های سریع</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/">خانه</Link></li>
              <li><Link href="/about/">درباره ما</Link></li>
              <li><Link href="/products/">محصولات</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>تماس با ما</h4>
            <p className={styles.footerText}>
              تلفن: ۰۹۱۰۹۹۰۳۱۳۶
            </p>
            <p className={styles.footerText}>
              تلفن: ۰۹۱۵۷۸۶۱۴۳۰
            </p>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} چیلو. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}

