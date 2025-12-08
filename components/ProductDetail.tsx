'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/lib/supabase'
import Toast from '@/components/Toast'
import styles from './ProductDetail.module.css'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart, cart, updateQuantity } = useCart()
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const cartItem = cart.find(item => item.id === product.id)

  const handleAddToCart = () => {
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

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
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
          <nav className={styles.breadcrumb}>
            <Link href="/">خانه</Link>
            <span> / </span>
            <Link href="/products/">محصولات</Link>
            <span> / </span>
            <span>{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.productContainer}>
            <div className={styles.productImageSection}>
              <div className={styles.productImageWrapper}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                  loading="eager"
                />
                <div className={styles.productBadge}>{product.grade}</div>
              </div>
            </div>

            <div className={styles.productInfoSection}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              
              <div className={styles.productMeta}>
                <span className={styles.productWeight}>{product.weight}</span>
                <span className={styles.productPrice}>{product.price}</span>
              </div>

              <div className={styles.productDescription}>
                <h2 className={styles.descriptionTitle}>توضیحات محصول</h2>
                <p>{product.description}</p>
              </div>

              <div className={styles.productActions}>
                {cartItem ? (
                  <div className={styles.quantityControl}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                      aria-label="کاهش تعداد"
                    >
                      −
                    </button>
                    <span className={styles.quantity}>{cartItem.quantity}</span>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                      aria-label="افزایش تعداد"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    className={styles.addToCartBtn}
                    onClick={handleAddToCart}
                  >
                    افزودن به سبد خرید
                  </button>
                )}
              </div>

              <div className={styles.productFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✨</span>
                  <div>
                    <h3>کیفیت ممتاز</h3>
                    <p>تضمین کیفیت و اصالت محصول</p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🚚</span>
                  <div>
                    <h3>ارسال سریع</h3>
                    <p>ارسال به سراسر کشور</p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔒</span>
                  <div>
                    <h3>پرداخت امن</h3>
                    <p>پرداخت مطمئن و امن</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

