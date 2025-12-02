import type { Metadata } from 'next'
import styles from './page.module.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'خانه - چیلو زعفران ممتاز',
  description: 'به چیلو خوش آمدید، منبع شما برای زعفران با کیفیت ممتاز. بهترین محصولات زعفران با طعم و عطر اصیل را کشف کنید.',
}

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            زعفران ممتاز
            <span className={styles.heroSubtitle}>از بهترین منابع</span>
          </h1>
          <p className={styles.heroDescription}>
            تجربه لوکس زعفران اصیل. مجموعه ممتاز ما بهترین کیفیت زعفران را با طعم غنی، 
            رنگ زنده و عطر دلنواز برای شما به ارمغان می‌آورد.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/products/" className="btn btn-primary">
              خرید کنید
            </Link>
            <Link href="/about/" className="btn btn-secondary">
              بیشتر بدانید
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.saffronVisual}>
            <div className={styles.saffronStrand}></div>
            <div className={styles.saffronStrand}></div>
            <div className={styles.saffronStrand}></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">چرا چیلو را انتخاب کنیم؟</h2>
          <p className="section-subtitle">
            ما فقط بهترین زعفران را تهیه می‌کنیم و کیفیت ممتاز و طعم اصیل را در هر محصول تضمین می‌کنیم.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <span>✨</span>
              </div>
              <h3 className={styles.featureTitle}>کیفیت ممتاز</h3>
              <p className={styles.featureText}>
                رشته‌های زعفران دستچین شده از بهترین منابع، با تضمین حداکثر طعم و عطر.
              </p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <span>🌿</span>
              </div>
              <h3 className={styles.featureTitle}>۱۰۰٪ طبیعی</h3>
              <p className={styles.featureText}>
                زعفران خالص و طبیعی بدون هیچ افزودنی یا نگهدارنده. طعم اصیل تضمین شده.
              </p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <span>🏆</span>
              </div>
              <h3 className={styles.featureTitle}>برنده جایزه</h3>
              <p className={styles.featureText}>
                به‌رسمیت شناخته شده برای برتری در کیفیت و طعم توسط متخصصان آشپزی در سراسر جهان.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} section`}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>آماده تجربه زعفران ممتاز هستید؟</h2>
            <p className={styles.ctaText}>
              مجموعه محصولات زعفران ممتاز ما را مرور کنید و خلاقیت‌های آشپزی خود را ارتقا دهید.
            </p>
            <Link href="/products/" className="btn btn-primary">
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

