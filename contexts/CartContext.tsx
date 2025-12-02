'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  price: string
  weight: string
  grade: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: (discountCode?: string) => string
  getDiscountAmount: (discountCode?: string) => number
  getFinalPrice: (discountCode?: string) => string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('chiiloo-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error loading cart from localStorage', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chiiloo-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Helper function to convert Persian/Arabic digits to ASCII
  const persianToEnglish = (str: string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    let result = str
    
    // Replace Persian digits
    persianDigits.forEach((persian, index) => {
      result = result.replace(new RegExp(persian, 'g'), index.toString())
    })
    
    // Replace Arabic digits
    arabicDigits.forEach((arabic, index) => {
      result = result.replace(new RegExp(arabic, 'g'), index.toString())
    })
    
    return result
  }

  // Calculate base total price (without discount)
  const calculateBaseTotal = (): number => {
    return cart.reduce((sum, item) => {
      const convertedPrice = persianToEnglish(item.price)
      const priceStr = convertedPrice.replace(/[^\d]/g, '')
      const price = parseInt(priceStr) || 0
      return sum + price * item.quantity
    }, 0)
  }

  // Check if discount code is valid
  const isValidDiscountCode = (code: string | undefined): boolean => {
    return code?.toLowerCase().trim() === 'khodadadiestend'
  }

  // Get discount amount in numeric value
  const getDiscountAmount = (discountCode?: string): number => {
    if (!isValidDiscountCode(discountCode)) return 0
    const baseTotal = calculateBaseTotal()
    return Math.round(baseTotal * 0.05) // 5% discount
  }

  // Get total price (base price without discount)
  const getTotalPrice = (discountCode?: string): string => {
    const total = calculateBaseTotal()
    return total.toLocaleString('fa-IR') + ' تومان'
  }

  // Get final price after discount
  const getFinalPrice = (discountCode?: string): string => {
    const baseTotal = calculateBaseTotal()
    const discount = getDiscountAmount(discountCode)
    const finalTotal = baseTotal - discount
    return finalTotal.toLocaleString('fa-IR') + ' تومان'
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getDiscountAmount,
        getFinalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

