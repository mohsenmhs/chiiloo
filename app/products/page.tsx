'use client'

import { useCart } from '@/contexts/CartContext'
import productsData from '@/data/products.json'
import styles from './page.module.css'

// Import product images directly
import image1 from '@/assets/img/1.jpg'
import image2 from '@/assets/img/2.jpg'
import image3 from '@/assets/img/3.jpg'

// Type definition for products
interface Product {
  id: number
  name: string
  description: string
  price: string
  weight: string
  grade: string
  image: string
}

// Helper function to get image src (handles both string and StaticImageData)
const getImageSrc = (img: string | { src: string }): string => {
  if (typeof img === 'string') return img
  return img.src
}

// Map image paths to imported images
const imageMap: { [key: string]: string } = {
  '/img/1.jpg': getImageSrc(image1 as any),
  '/img/2.jpg': getImageSrc(image2 as any),
  '/img/3.jpg': getImageSrc(image3 as any),
}

const products: Product[] = productsData.map(product => {
  const mappedImage = imageMap[product.image] || product.image
  // Debug: log image paths
  if (typeof window !== 'undefined') {
    console.log(`Product ${product.id} image:`, product.image, '->', mappedImage)
  }
  return {
    ...product,
    image: mappedImage
  }
})

export default function Products() {
  const { addToCart } = useCart()

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      grade: product.grade,
    })
  }

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>محصولات ما</h1>
          <p className={styles.heroSubtitle}>
            مجموعه ممتاز محصولات زعفران ما را کشف کنید
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImageContent}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      console.error('Image failed to load:', product.image, 'for product:', product.name)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent && !parent.querySelector(`.${styles.saffronIcon}`)) {
                        const icon = document.createElement('div')
                        icon.className = styles.saffronIcon
                        icon.textContent = '🌿'
                        parent.appendChild(icon)
                      }
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', product.image)
                    }}
                  />
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
                    <button 
                      className={styles.addToCartBtn}
                      onClick={() => handleAddToCart(product)}
                    >
                      افزودن به سبد
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.infoSection} section`}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--white)' }}>ضمانت کیفیت</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3>۱۰۰٪ اصیل</h3>
              <p>تمام زعفران ما برای اصالت آزمایش و تأیید شده است</p>
            </div>
            <div className={styles.infoItem}>
              <h3>درجه ممتاز</h3>
              <p>فقط با کیفیت‌ترین رشته‌های زعفران به مجموعه ما راه می‌یابند</p>
            </div>
            <div className={styles.infoItem}>
              <h3>تازه و قوی</h3>
              <p>با دقت نگهداری شده تا حداکثر طعم و عطر حفظ شود</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

