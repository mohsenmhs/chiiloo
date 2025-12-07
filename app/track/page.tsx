'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Order, OrderStatus } from '@/lib/supabase'
import styles from './page.module.css'

const statusLabels: Record<OrderStatus, string> = {
  pending: 'در انتظار تایید',
  confirmed: 'تایید شده',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
}

const statusColors: Record<OrderStatus, string> = {
  pending: '#ffa500',
  confirmed: '#4CAF50',
  processing: '#2196F3',
  shipped: '#9C27B0',
  delivered: '#4CAF50',
  cancelled: '#f44336',
}

export default function TrackOrder() {
  const searchParams = useSearchParams()
  const [searchType, setSearchType] = useState<'code' | 'phone'>('code')
  const [trackingCode, setTrackingCode] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const codeParam = searchParams?.get('code')
    if (codeParam) {
      setTrackingCode(codeParam)
      setSearchType('code')
    }
  }, [searchParams])

  const handleSearch = async () => {
    if (searchType === 'code' && !trackingCode.trim()) {
      setError('لطفاً کد پیگیری را وارد کنید')
      return
    }
    if (searchType === 'phone' && !phone.trim()) {
      setError('لطفاً شماره تماس را وارد کنید')
      return
    }

    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      let query = supabase.from('orders').select('*')

      if (searchType === 'code') {
        query = query.eq('tracking_code', trackingCode.trim().toUpperCase())
      } else {
        query = query.eq('phone', phone.trim())
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false }).limit(1)

      if (fetchError) {
        throw fetchError
      }

      if (!data || data.length === 0) {
        setError('سفارشی با این اطلاعات یافت نشد')
        return
      }

      setOrder(data[0] as Order)
    } catch (err: any) {
      console.error('Error fetching order:', err)
      setError(err.message || 'خطا در جستجوی سفارش')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان'
  }

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>پیگیری سفارش</h1>
          <p className={styles.heroSubtitle}>وضعیت سفارش خود را با کد پیگیری یا شماره تماس بررسی کنید</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.trackContainer}>
            <div className={styles.searchCard}>
              <div className={styles.searchTabs}>
                <button
                  className={`${styles.tab} ${searchType === 'code' ? styles.activeTab : ''}`}
                  onClick={() => setSearchType('code')}
                >
                  جستجو با کد پیگیری
                </button>
                <button
                  className={`${styles.tab} ${searchType === 'phone' ? styles.activeTab : ''}`}
                  onClick={() => setSearchType('phone')}
                >
                  جستجو با شماره تماس
                </button>
              </div>

              <div className={styles.searchForm}>
                {searchType === 'code' ? (
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                      placeholder="کد پیگیری را وارد کنید"
                      className={styles.input}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch()
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className={styles.inputGroup}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="شماره تماس را وارد کنید"
                      className={styles.input}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch()
                        }
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className={`btn btn-primary ${styles.searchBtn}`}
                >
                  {loading ? 'در حال جستجو...' : 'جستجو'}
                </button>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}
            </div>

            {order && (
              <div className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h2 className={styles.orderTitle}>جزئیات سفارش</h2>
                    <p className={styles.trackingCode}>کد پیگیری: <strong>{order.tracking_code}</strong></p>
                  </div>
                  <div
                    className={styles.statusBadge}
                    style={{ backgroundColor: statusColors[order.status] }}
                  >
                    {statusLabels[order.status]}
                  </div>
                </div>

                <div className={styles.orderInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>نام و نام خانوادگی:</span>
                    <span className={styles.infoValue}>{order.first_name} {order.last_name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>شماره تماس:</span>
                    <span className={styles.infoValue}>{order.phone}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>آدرس:</span>
                    <span className={styles.infoValue}>{order.address}</span>
                  </div>
                  {order.notes && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>توضیحات:</span>
                      <span className={styles.infoValue}>{order.notes}</span>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>تاریخ ثبت سفارش:</span>
                    <span className={styles.infoValue}>{formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  <h3 className={styles.itemsTitle}>محصولات سفارش:</h3>
                  <div className={styles.itemsList}>
                    {order.items.map((item, index) => (
                      <div key={index} className={styles.orderItem}>
                        <div className={styles.itemDetails}>
                          <span className={styles.itemName}>{item.product_name}</span>
                          <span className={styles.itemSpecs}>
                            {item.product_weight} - {item.product_grade}
                          </span>
                        </div>
                        <div className={styles.itemQuantity}>
                          {item.quantity} عدد
                        </div>
                        <div className={styles.itemPrice}>
                          {item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.orderSummary}>
                  <div className={styles.summaryRow}>
                    <span>مجموع کل:</span>
                    <span>{formatPrice(order.total_price)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className={styles.summaryRow}>
                      <span>تخفیف:</span>
                      <span style={{ color: '#4CAF50' }}>-{formatPrice(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className={`${styles.summaryRow} ${styles.finalRow}`}>
                    <span>مبلغ نهایی:</span>
                    <span>{formatPrice(order.final_price)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

