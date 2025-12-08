'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { supabase, OrderItem, OrderStatus } from '@/lib/supabase'
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

// Helper function to convert Persian/Arabic digits to ASCII
const persianToEnglish = (str: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  let result = str
  
  persianDigits.forEach((persian, index) => {
    result = result.replace(new RegExp(persian, 'g'), index.toString())
  })
  
  arabicDigits.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), index.toString())
  })
  
  return result
}

// Generate tracking code as a 10-digit number
const generateTrackingCode = (): string => {
  // Generate a random number between 1000000000 and 9999999999 (10 digits)
  const min = 1000000000
  const max = 9999999999
  const trackingCode = Math.floor(Math.random() * (max - min + 1)) + min
  return trackingCode.toString()
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getDiscountAmount, getFinalPrice } = useCart()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  
  const isValidDiscount = appliedDiscountCode?.toLowerCase().trim() === 'khodadadiestend'
  const discountAmount = getDiscountAmount(isValidDiscount ? appliedDiscountCode : undefined)
  const baseTotal = getTotalPrice()
  const finalTotal = getFinalPrice(isValidDiscount ? appliedDiscountCode : undefined)
  
  // Calculate numeric prices for database
  const calculateNumericPrice = (priceStr: string): number => {
    const converted = persianToEnglish(priceStr)
    const priceNum = parseInt(converted.replace(/[^\d]/g, '')) || 0
    return priceNum
  }

  const handleApplyDiscount = () => {
    const code = discountCode.toLowerCase().trim()
    if (code === 'khodadadiestend') {
      setAppliedDiscountCode(discountCode)
    } else {
      alert('کد تخفیف نامعتبر است')
      setAppliedDiscountCode(null)
    }
  }

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
    setTrackingCode(null)

    try {
      // Generate tracking code
      const newTrackingCode = generateTrackingCode()
      
      // Prepare order items for database
      const orderItems: OrderItem[] = cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_weight: item.weight,
        product_grade: item.grade,
        quantity: item.quantity,
        price: item.price,
      }))

      // Calculate numeric prices
      const totalPriceNum = cart.reduce((sum, item) => {
        const priceNum = calculateNumericPrice(item.price)
        return sum + priceNum * item.quantity
      }, 0)
      
      const discountAmountNum = isValidDiscount ? discountAmount : 0
      const finalPriceNum = totalPriceNum - discountAmountNum

      // Save order to Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          tracking_code: newTrackingCode,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes || null,
          items: orderItems,
          total_price: totalPriceNum,
          discount_code: isValidDiscount ? appliedDiscountCode : null,
          discount_amount: discountAmountNum,
          final_price: finalPriceNum,
          status: 'pending' as OrderStatus,
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(`خطا در ثبت سفارش: ${orderError.message}`)
      }

      // Optionally send email via EmailJS if configured
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (emailjs && serviceId && templateId && publicKey && 
          serviceId !== 'YOUR_SERVICE_ID' && 
          templateId !== 'YOUR_TEMPLATE_ID' && 
          publicKey !== 'YOUR_PUBLIC_KEY') {
        try {
          const orderItems = cart.map((item) => 
            `${item.name} - ${item.weight} - ${item.quantity} عدد - ${item.price}`
          ).join('\n')

          const orderDetails = `
نام و نام خانوادگی: ${formData.firstName} ${formData.lastName}
شماره تماس: ${formData.phone}
آدرس: ${formData.address}
کد پیگیری: ${newTrackingCode}
${formData.notes ? `توضیحات: ${formData.notes}` : ''}
${isValidDiscount ? `کد تخفیف: ${appliedDiscountCode}` : ''}

محصولات سفارش:
${orderItems}

${isValidDiscount ? `مجموع کل: ${baseTotal}\nتخفیف (۵٪): ${discountAmount.toLocaleString('fa-IR')} تومان\nمبلغ نهایی: ${finalTotal}` : `مجموع کل: ${finalTotal}`}
          `.trim()

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
              discount_code: isValidDiscount ? appliedDiscountCode : '',
              discount_amount: isValidDiscount ? discountAmount.toLocaleString('fa-IR') + ' تومان' : '0',
              order_total: finalTotal,
              base_total: baseTotal,
              tracking_code: newTrackingCode,
            },
            publicKey
          )
        } catch (emailError) {
          // Don't fail the order if email fails
          console.warn('Failed to send email notification:', emailError)
        }
      }

      setTrackingCode(newTrackingCode)
      setSubmitStatus('success')
      clearCart()
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        notes: '',
      })
      setDiscountCode('')
      setAppliedDiscountCode(null)
    } catch (error: any) {
      console.error('Error submitting order:', error)
      const errorMessage = error?.message || 'خطا در ثبت سفارش'
      alert(errorMessage)
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
            {trackingCode && (
              <div style={{ margin: '1.5rem 0', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>کد پیگیری سفارش:</p>
                <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', letterSpacing: '0.2em' }}>{trackingCode}</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                  می‌توانید با این کد یا شماره تماس خود وضعیت سفارش را پیگیری کنید.
                </p>
              </div>
            )}
            <p className={styles.successText}>
              سفارش شما دریافت شد و به زودی با شما تماس خواهیم گرفت.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {trackingCode && (
                <a href={`/track?code=${trackingCode}`} className="btn btn-secondary">پیگیری سفارش</a>
              )}
              <a href="/products/" className="btn btn-primary">بازگشت به محصولات</a>
            </div>
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
              
              <div className={styles.discountSection}>
                <div className={styles.discountInputGroup}>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className={styles.discountInput}
                    placeholder="کد تخفیف را وارد کنید"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleApplyDiscount()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className={styles.applyDiscountBtn}
                  >
                    اعمال
                  </button>
                </div>
                {appliedDiscountCode && isValidDiscount && (
                  <span className={styles.discountSuccess}>✓ کد تخفیف اعمال شد (۵٪ تخفیف)</span>
                )}
                {appliedDiscountCode && !isValidDiscount && (
                  <span className={styles.discountError}>کد تخفیف نامعتبر است</span>
                )}
              </div>

              <div className={styles.cartTotal}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>مجموع کل:</span>
                  <span className={styles.totalPrice}>{baseTotal}</span>
                </div>
                {isValidDiscount && discountAmount > 0 && (
                  <>
                    <div className={styles.totalRow}>
                      <span className={styles.discountLabel}>تخفیف (۵٪):</span>
                      <span className={styles.discountAmount}>-{discountAmount.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div className={styles.totalRow} style={{ borderTop: '2px solid var(--saffron-purple)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      <span className={styles.finalLabel}>مبلغ نهایی:</span>
                      <span className={styles.finalPrice}>{finalTotal}</span>
                    </div>
                  </>
                )}
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
                    placeholder="09109903136"
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

