'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from './page.module.css'

// Dynamically import EmailJS to handle cases where it's not installed
let emailjs: any = null
if (typeof window !== 'undefined') {
  try {
    emailjs = require('@emailjs/browser')
  } catch (e) {
    console.warn('EmailJS is not installed. Please run: npm install @emailjs/browser')
  }
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      alert('سبد خرید شما خالی است!')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Prepare order details
      const orderItems = cart.map((item) => 
        `${item.name} - ${item.weight} - ${item.quantity} عدد - ${item.price}`
      ).join('\n')

      const orderDetails = `
نام و نام خانوادگی: ${formData.firstName} ${formData.lastName}
شماره تماس: ${formData.phone}
آدرس: ${formData.address}
${formData.notes ? `توضیحات: ${formData.notes}` : ''}

محصولات سفارش:
${orderItems}

مجموع کل: ${getTotalPrice()}
      `.trim()

      // EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!emailjs) {
        throw new Error('EmailJS package is not installed. Please run: npm install @emailjs/browser')
      }

      if (!serviceId || !templateId || !publicKey || 
          serviceId === 'YOUR_SERVICE_ID' || 
          templateId === 'YOUR_TEMPLATE_ID' || 
          publicKey === 'YOUR_PUBLIC_KEY') {
        throw new Error('EmailJS is not configured. Please check SETUP_EMAILJS.md for instructions.')
      }

      // Send email using EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: 'mohsen.kh87@gmail.com',
          from_name: `${formData.firstName} ${formData.lastName}`,
          message: orderDetails,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes || 'بدون توضیحات',
          order_total: getTotalPrice(),
        },
        publicKey
      )

      setSubmitStatus('success')
      clearCart()
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        notes: '',
      })
    } catch (error: any) {
      console.error('Error sending email:', error)
      const errorMessage = error?.message || 'خطا در ارسال سفارش'
      if (errorMessage.includes('EmailJS is not configured') || errorMessage.includes('SETUP_EMAILJS')) {
        alert('لطفاً ابتدا EmailJS را راه‌اندازی کنید. فایل SETUP_EMAILJS.md را مطالعه کنید.')
      } else if (errorMessage.includes('not installed')) {
        alert('لطفاً ابتدا پکیج EmailJS را نصب کنید: npm install @emailjs/browser')
      }
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0 && submitStatus !== 'success') {
    return (
      <div className={styles.emptyCart}>
        <div className="container">
          <div className={styles.emptyCartContent}>
            <h1 className={styles.emptyCartTitle}>سبد خرید شما خالی است</h1>
            <p className={styles.emptyCartText}>برای افزودن محصول به سبد خرید، به صفحه محصولات بروید.</p>
            <a href="/products/" className="btn btn-primary">مشاهده محصولات</a>
          </div>
        </div>
      </div>
    )
  }

  if (submitStatus === 'success') {
    return (
      <div className={styles.successMessage}>
        <div className="container">
          <div className={styles.successContent}>
            <h1 className={styles.successTitle}>سفارش شما با موفقیت ثبت شد!</h1>
            <p className={styles.successText}>
              سفارش شما دریافت شد و به زودی با شما تماس خواهیم گرفت.
            </p>
            <a href="/products/" className="btn btn-primary">بازگشت به محصولات</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>سبد خرید</h1>
          <p className={styles.heroSubtitle}>لطفاً اطلاعات خود را تکمیل کنید</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.cartLayout}>
            <div className={styles.cartItems}>
              <h2 className={styles.sectionTitle}>محصولات انتخابی</h2>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemDetails}>
                      {item.weight} - {item.grade}
                    </p>
                    <p className={styles.itemPrice}>{item.price}</p>
                  </div>
                  <div className={styles.itemControls}>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={styles.quantityBtn}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={styles.quantityBtn}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeBtn}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
              <div className={styles.cartTotal}>
                <span className={styles.totalLabel}>مجموع کل:</span>
                <span className={styles.totalPrice}>{getTotalPrice()}</span>
              </div>
            </div>

            <div className={styles.orderForm}>
              <h2 className={styles.sectionTitle}>اطلاعات سفارش</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>
                      نام
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="09123456789"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address" className={styles.label}>
                    آدرس
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className={styles.textarea}
                    rows={4}
                    placeholder="آدرس کامل خود را وارد کنید"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="notes" className={styles.label}>
                    توضیحات (اختیاری)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={3}
                    placeholder="هر توضیح یا درخواست اضافی را اینجا بنویسید..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    خطا در ارسال سفارش. لطفاً دوباره تلاش کنید.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`btn btn-primary ${styles.submitBtn}`}
                >
                  {isSubmitting ? 'در حال ارسال...' : 'ارسال سفارش'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

