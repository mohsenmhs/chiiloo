'use client'

import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'

// Import product images directly
import image1 from '@/assets/img/1.jpg'
import image2 from '@/assets/img/2.jpg'
import image3 from '@/assets/img/d.webp'
import imageZe from '@/assets/img/ze.jpg'
import imageA from '@/assets/img/a.jpg'
import imageHa from '@/assets/img/ha.jpg'

// Helper function to get image src (handles both string and StaticImageData)
const getImageSrc = (img: string | { src: string }): string => {
  if (typeof img === 'string') return img
  return img.src
}

// Map image paths to imported images
const imageMap: { [key: string]: string } = {
  '/img/1.jpg': getImageSrc(image1 as any),
  '/img/2.jpg': getImageSrc(image2 as any),
  '/img/d.webp': getImageSrc(image3 as any),
  '/img/ze.jpg': getImageSrc(imageZe as any),
  '/img/a.jpg': getImageSrc(imageA as any),
  '/img/ha.jpg': getImageSrc(imageHa as any),
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('id', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        // Map images to local assets
        const mappedProducts = (data || []).map(product => {
          const mappedImage = imageMap[product.image] || product.image
          return {
            ...product,
            image: mappedImage
          }
        })

        setProducts(mappedProducts)
      } catch (err: any) {
        console.error('Error fetching products:', err)
        setError(err.message || 'خطا در بارگذاری محصولات')
        // Fallback to empty array on error
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useSpecialProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSpecialProducts() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .eq('special', true)
          .order('id', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        // Map images to local assets
        const mappedProducts = (data || []).map(product => {
          const mappedImage = imageMap[product.image] || product.image
          return {
            ...product,
            image: mappedImage
          }
        })

        setProducts(mappedProducts)
      } catch (err: any) {
        console.error('Error fetching special products:', err)
        setError(err.message || 'خطا در بارگذاری محصولات')
        // Fallback to empty array on error
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialProducts()
  }, [])

  return { products, loading, error }
}

