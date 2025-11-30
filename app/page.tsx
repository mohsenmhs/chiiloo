import type { Metadata } from 'next'
import styles from './page.module.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home - Chiiloo Premium Saffron',
  description: 'Welcome to Chiiloo, your source for premium quality saffron. Discover the finest saffron products with authentic flavor and aroma.',
}

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Premium Saffron
            <span className={styles.heroSubtitle}>From the Finest Sources</span>
          </h1>
          <p className={styles.heroDescription}>
            Experience the luxury of authentic saffron. Our premium collection brings you 
            the finest quality saffron with rich flavor, vibrant color, and exquisite aroma.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/products/" className="btn btn-primary">
              Shop Now
            </Link>
            <Link href="/about/" className="btn btn-secondary">
              Learn More
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
          <h2 className="section-title">Why Choose Chiiloo?</h2>
          <p className="section-subtitle">
            We source only the finest saffron, ensuring premium quality and authentic flavor in every product.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <span>✨</span>
              </div>
              <h3 className={styles.featureTitle}>Premium Quality</h3>
              <p className={styles.featureText}>
                Hand-picked saffron threads from the finest sources, ensuring maximum flavor and aroma.
              </p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <span>🌿</span>
              </div>
              <h3 className={styles.featureTitle}>100% Natural</h3>
              <p className={styles.featureText}>
                Pure, natural saffron with no additives or preservatives. Authentic taste guaranteed.
              </p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <span>🏆</span>
              </div>
              <h3 className={styles.featureTitle}>Award Winning</h3>
              <p className={styles.featureText}>
                Recognized for excellence in quality and flavor by culinary experts worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} section`}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Experience Premium Saffron?</h2>
            <p className={styles.ctaText}>
              Browse our collection of premium saffron products and elevate your culinary creations.
            </p>
            <Link href="/products/" className="btn btn-primary">
              View Products
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

