import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be provided in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  weight: string
  grade: string
  image: string
  active: boolean
  special: boolean
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  tracking_code: string
  first_name: string
  last_name: string
  phone: string
  address: string
  notes?: string
  items: OrderItem[]
  total_price: number
  discount_code?: string
  discount_amount: number
  final_price: number
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: number
  product_name: string
  product_weight: string
  product_grade: string
  quantity: number
  price: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

