'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { fetchProductsClient, WordPressProduct } from '@/lib/wordpress'
import productsData from '@/data/products.json'
import Toast from '@/components/Toast'
import styles from './page.module.css'

// Import product images directly (fallback)
import image1 from '@/assets/img/1.jpg'
import image2 from '@/assets/img/2.jpg'
import image3 from '@/assets/img/d.webp'
import imageZe from '@/assets/img/ze.jpg'
import imageA from '@/assets/img/a.jpg'
import imageHa from '@/assets/img/ha.jpg'

// Type definition for products (compatible with both WordPress and JSON)
type Product = WordPressProduct & {
  weight: string
  grade: string
}

// Helper function to get image src (handles both string and StaticImageData)
const getImageSrc = (img: string | { src: string }): string => {
  if (typeof img === 'string') return img
  return img.src
}

// Map image paths to imported images (fallback for local images)
const imageMap: { [key: string]: string } = {
  '/img/1.jpg': getImageSrc(image1 as any),
  '/img/2.jpg': getImageSrc(image2 as any),
  '/img/d.webp': getImageSrc(image3 as any),
  '/img/ze.jpg': getImageSrc(imageZe as any),
  '/img/a.jpg': getImageSrc(imageA as any),
  '/img/ha.jpg': getImageSrc(imageHa as any),
}

// Fallback products from JSON
const fallbackProducts: Product[] = productsData.map(product => {
  const mappedImage = imageMap[product.image] || product.image
  return {
    ...product,
    image: mappedImage
  }
})

export default function Products() {
  const { addToCart, cart, updateQuantity, getTotalItems } = useCart()
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from WordPress on mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const wpProducts = await fetchProductsClient()
        
        if (wpProducts && wpProducts.length > 0) {
          // Transform WordPress products to match our Product type
          const transformedProducts: Product[] = wpProducts.map((wp: WordPressProduct) => ({
            ...wp,
            weight: wp.weight || '',
            grade: wp.grade || '',
            // Clean HTML from description if needed
            description: wp.description.replace(/<[^>]*>/g, '').trim() || wp.description,
          }))
          setProducts(transformedProducts)
        } else {
          // If no WordPress products, use fallback
          console.log('No WordPress products found, using fallback data')
          setProducts(fallbackProducts)
        }
      } catch (err) {
        console.error('Error loading products from WordPress:', err)
        setError('خطا در بارگذاری محصولات')
        // Use fallback products on error
        setProducts(fallbackProducts)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      grade: product.grade,
    })

    // Show notification
    setToastMessage(`${product.name} به سبد خرید اضافه شد`)
    setShowToast(true)
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
  }

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
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
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>در حال بارگذاری محصولات...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--error, red)' }}>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>محصولی یافت نشد</p>
            </div>
          )}

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
                    {(() => {
                      const cartItem = cart.find(item => item.id === product.id)
                      if (cartItem) {
                        return (
                          <div className={styles.quantityControl}>
                            <button
                              className={styles.quantityBtn}
                              onClick={() => handleUpdateQuantity(product.id, cartItem.quantity - 1)}
                              aria-label="کاهش تعداد"
                            >
                              −
                            </button>
                            <span className={styles.quantity}>{cartItem.quantity}</span>
                            <button
                              className={styles.quantityBtn}
                              onClick={() => handleUpdateQuantity(product.id, cartItem.quantity + 1)}
                              aria-label="افزایش تعداد"
                            >
                              +
                            </button>
                          </div>
                        )
                      }
                      return (
                        <button 
                          className={styles.addToCartBtn}
                          onClick={() => handleAddToCart(product)}
                        >
                          افزودن به سبد
                        </button>
                      )
                    })()}
                  </div>
                  {cart.length > 0 && (
                    <Link href="/cart/" className={styles.cartLink}>
                      مشاهده سبد خرید ({getTotalItems()})
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.infoSection} section`}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--white)', WebkitTextFillColor: 'var(--white)' }}>ضمانت کیفیت</h2>
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

