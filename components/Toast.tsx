'use client'

import { useEffect } from 'react'
import styles from './Toast.module.css'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={styles.toast}>
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>✓</span>
        <span className={styles.toastMessage}>{message}</span>
      </div>
    </div>
  )
}
