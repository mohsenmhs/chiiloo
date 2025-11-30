import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Products - Chiiloo Premium Saffron',
  description: 'Browse our collection of premium saffron products. From premium threads to saffron powder, find the perfect saffron for your culinary needs.',
  keywords: 'saffron products, premium saffron, saffron threads, saffron powder, buy saffron',
}

const products = [
  {
    id: 1,
    name: 'Premium Saffron Threads',
    description: 'Hand-picked premium saffron threads with intense flavor and vibrant color. Perfect for rice dishes, desserts, and beverages.',
    price: '$29.99',
    weight: '1g',
    grade: 'Grade A',
  },
  {
    id: 2,
    name: 'Deluxe Saffron Collection',
    description: 'Our finest selection of saffron threads, carefully sorted for maximum quality. Ideal for special occasions and gourmet cooking.',
    price: '$59.99',
    weight: '2g',
    grade: 'Premium',
  },
  {
    id: 3,
    name: 'Saffron Powder',
    description: 'Finely ground premium saffron powder for easy use in recipes. Maintains the authentic flavor and aroma of whole threads.',
    price: '$24.99',
    weight: '1g',
    grade: 'Grade A',
  },
  {
    id: 4,
    name: 'Saffron Gift Set',
    description: 'A beautiful gift set containing premium saffron threads and a recipe booklet. Perfect for saffron enthusiasts.',
    price: '$79.99',
    weight: '3g',
    grade: 'Premium',
  },
  {
    id: 5,
    name: 'Culinary Saffron Pack',
    description: 'A practical pack of saffron threads designed for everyday cooking. Great value for regular use.',
    price: '$19.99',
    weight: '0.5g',
    grade: 'Grade A',
  },
  {
    id: 6,
    name: 'Luxury Saffron Reserve',
    description: 'Our most exclusive saffron collection, featuring the rarest and finest threads. For the ultimate culinary experience.',
    price: '$149.99',
    weight: '5g',
    grade: 'Reserve',
  },
]

export default function Products() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Our Products</h1>
          <p className={styles.heroSubtitle}>
            Discover our premium collection of saffron products
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <div className={styles.saffronIcon}>🌿</div>
                  <div className={styles.productBadge}>{product.grade}</div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                  <div className={styles.productDetails}>
                    <span className={styles.productWeight}>{product.weight}</span>
                  </div>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>{product.price}</span>
                    <button className={styles.addToCartBtn}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.infoSection} section`}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--white)' }}>Quality Guarantee</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3>100% Authentic</h3>
              <p>All our saffron is tested and verified for authenticity</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Premium Grade</h3>
              <p>Only the highest quality saffron threads make it to our collection</p>
            </div>
            <div className={styles.infoItem}>
              <h3>Fresh & Potent</h3>
              <p>Carefully stored to maintain maximum flavor and aroma</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

