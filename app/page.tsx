'use client'

import { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useProducts } from '@/lib/hooks/useProducts'
import Toast from '@/components/Toast'
import bgImage from '@/assets/img/bg.jpg'

// Helper function to get image src (handles both string and StaticImageData)
const getImageSrc = (img: string | { src: string }): string => {
  if (typeof img === 'string') return img
  return img.src
}

export default function Home() {
  const { addToCart, cart, updateQuantity } = useCart()
  const { products, loading } = useProducts()
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      grade: product.grade,
    })
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
      <section className={styles.hero} style={{ backgroundImage: `url(${getImageSrc(bgImage as any)})` }}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                زعفران چیلو
                <span className={styles.heroSubtitle}>
                  از دل مزارع روستای استند - قاینات
                </span>
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
          </div>
          
          <div className={styles.heroProducts}>
            <h2 className={styles.heroProductsTitle}>محصولات برتر</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>در حال بارگذاری...</div>
            ) : (
            <div className={styles.heroProductsGrid}>
              {products.slice(0, 5).map((product) => {
                const cartItem = cart.find(item => item.id === product.id)
                return (
                  <div key={product.id} className={styles.heroProductCard}>
                    <div className={styles.heroProductImage}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.heroProductImageContent}
                        loading="lazy"
                      />
                      <div className={styles.heroProductBadge}>{product.grade}</div>
                    </div>
                    <div className={styles.heroProductInfo}>
                      <h3 className={styles.heroProductName}>{product.name}</h3>
                      <div className={styles.heroProductDetails}>
                        <span className={styles.heroProductWeight}>{product.weight}</span>
                        <span className={styles.heroProductPrice}>{product.price}</span>
                      </div>
                      <div className={styles.heroProductFooter}>
                        {cartItem ? (
                          <div className={styles.heroQuantityControl}>
                            <button
                              className={styles.heroQuantityBtn}
                              onClick={() => handleUpdateQuantity(product.id, cartItem.quantity - 1)}
                              aria-label="کاهش تعداد"
                            >
                              −
                            </button>
                            <span className={styles.heroQuantity}>{cartItem.quantity}</span>
                            <button
                              className={styles.heroQuantityBtn}
                              onClick={() => handleUpdateQuantity(product.id, cartItem.quantity + 1)}
                              aria-label="افزایش تعداد"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            className={styles.heroAddToCartBtn}
                            onClick={() => handleAddToCart(product)}
                          >
                            افزودن به سبد
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            )}
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
              <h3 className={styles.featureTitle}>وفادار به مشتری</h3>
              <p className={styles.featureText}>
                ما وفادار به مشتری های خود هستیم و به آنها خدمات بهتری را ارائه می‌کنیم.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

