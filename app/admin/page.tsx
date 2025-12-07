'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    fetchOrders()
  }, [router, filterStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setOrders((data || []) as Order[])
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'خطا در بارگذاری سفارشات')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId)
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (updateError) {
        throw updateError
      }

      // Refresh orders
      await fetchOrders()
    } catch (err: any) {
      console.error('Error updating order status:', err)
      alert(`خطا در به‌روزرسانی وضعیت: ${err.message}`)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    sessionStorage.removeItem('admin_email')
    router.push('/admin/login')
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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  return (
    <>
      <section className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <h1 className={styles.title}>پنل مدیریت سفارشات</h1>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              خروج
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              همه سفارشات ({orders.length})
            </button>
            {statusOptions.map((status) => {
              const count = orders.filter(o => o.status === status).length
              return (
                <button
                  key={status}
                  className={`${styles.filterBtn} ${filterStatus === status ? styles.activeFilter : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {statusLabels[status]} ({count})
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className={styles.loading}>در حال بارگذاری...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>هیچ سفارشی یافت نشد</div>
          ) : (
            <div className={styles.ordersList}>
              {filteredOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3 className={styles.orderTitle}>
                        سفارش #{order.tracking_code}
                      </h3>
                      <p className={styles.orderDate}>
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className={styles.orderActions}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                        disabled={updatingOrderId === order.id}
                        className={styles.statusSelect}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.orderInfo}>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>نام:</span>
                        <span className={styles.infoValue}>
                          {order.first_name} {order.last_name}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>شماره تماس:</span>
                        <span className={styles.infoValue}>{order.phone}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>آدرس:</span>
                        <span className={styles.infoValue}>{order.address}</span>
                      </div>
                      {order.notes && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>توضیحات:</span>
                          <span className={styles.infoValue}>{order.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.orderItems}>
                    <h4 className={styles.itemsTitle}>محصولات:</h4>
                    <div className={styles.itemsList}>
                      {order.items.map((item, index) => (
                        <div key={index} className={styles.itemRow}>
                          <span>{item.product_name}</span>
                          <span>{item.product_weight} - {item.product_grade}</span>
                          <span>{item.quantity} عدد</span>
                          <span>{item.price}</span>
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
                        <span>-{formatPrice(order.discount_amount)}</span>
                      </div>
                    )}
                    <div className={styles.finalRow}>
                      <span>مبلغ نهایی:</span>
                      <span>{formatPrice(order.final_price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

