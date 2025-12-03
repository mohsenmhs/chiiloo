/**
 * WordPress API Integration
 * 
 * This file contains utilities for fetching data from WordPress REST API
 * Supports both standard WordPress posts and WooCommerce products
 */

export interface WordPressProduct {
  id: number
  name: string
  description: string
  price: string
  weight?: string
  grade?: string
  image: string
  slug?: string
  permalink?: string
  // WooCommerce specific fields
  regular_price?: string
  sale_price?: string
  stock_status?: string
  in_stock?: boolean
  // ACF (Advanced Custom Fields) support
  acf?: {
    weight?: string
    grade?: string
    [key: string]: any
  }
}

export interface WordPressImage {
  id: number
  source_url: string
  alt_text?: string
  media_details?: {
    width?: number
    height?: number
  }
}

/**
 * Fetch products from WordPress REST API
 * Supports both standard WordPress posts and WooCommerce products
 */
export async function fetchWordPressProducts(): Promise<WordPressProduct[]> {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL
  
  if (!wpUrl) {
    console.warn('WordPress URL not configured. Using fallback data.')
    return []
  }

  try {
    // Try WooCommerce first (if WooCommerce is installed)
    const wooCommerceUrl = `${wpUrl}/wp-json/wc/v3/products`
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET

    if (consumerKey && consumerSecret) {
      // Use WooCommerce REST API
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
      const response = await fetch(wooCommerceUrl, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 } // Revalidate every 60 seconds
      })

      if (response.ok) {
        const products = await response.json()
        return products.map(transformWooCommerceProduct)
      }
    }

    // Fallback to standard WordPress REST API
    const wpApiUrl = `${wpUrl}/wp-json/wp/v2/products?per_page=100&status=publish`
    const response = await fetch(wpApiUrl, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`)
    }

    const products = await response.json()
    return products.map(transformWordPressProduct)
  } catch (error) {
    console.error('Error fetching WordPress products:', error)
    return []
  }
}

/**
 * Transform WooCommerce product to our format
 */
function transformWooCommerceProduct(wcProduct: any): WordPressProduct {
  const image = wcProduct.images?.[0]?.src || wcProduct.featured_image || ''
  const price = wcProduct.sale_price 
    ? `${parseInt(wcProduct.sale_price).toLocaleString('fa-IR')} تومان`
    : `${parseInt(wcProduct.regular_price || '0').toLocaleString('fa-IR')} تومان`

  return {
    id: wcProduct.id,
    name: wcProduct.name || '',
    description: wcProduct.description || wcProduct.short_description || '',
    price,
    weight: wcProduct.meta_data?.find((m: any) => m.key === 'weight')?.value || 
            wcProduct.weight || '',
    grade: wcProduct.meta_data?.find((m: any) => m.key === 'grade')?.value || 
           wcProduct.categories?.[0]?.name || '',
    image,
    slug: wcProduct.slug,
    regular_price: wcProduct.regular_price,
    sale_price: wcProduct.sale_price,
    stock_status: wcProduct.stock_status,
    in_stock: wcProduct.stock_status === 'instock',
  }
}

/**
 * Transform standard WordPress post/product to our format
 */
function transformWordPressProduct(wpPost: any): WordPressProduct {
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0]
  const image = featuredMedia?.source_url || wpPost.featured_media_url || ''

  // Try to extract price from ACF fields or meta
  let price = ''
  if (wpPost.acf?.price) {
    price = wpPost.acf.price
  } else if (wpPost.meta?.price) {
    const priceNum = parseInt(wpPost.meta.price)
    price = `${priceNum.toLocaleString('fa-IR')} تومان`
  }

  return {
    id: wpPost.id,
    name: wpPost.title?.rendered || wpPost.title || '',
    description: wpPost.content?.rendered || wpPost.content || wpPost.excerpt?.rendered || '',
    price: price || 'قیمت تماس بگیرید',
    weight: wpPost.acf?.weight || wpPost.meta?.weight || '',
    grade: wpPost.acf?.grade || wpPost.meta?.grade || '',
    image,
    slug: wpPost.slug,
    permalink: wpPost.link,
    acf: wpPost.acf,
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchWordPressProduct(id: number): Promise<WordPressProduct | null> {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL
  
  if (!wpUrl) {
    return null
  }

  try {
    // Try WooCommerce first
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET

    if (consumerKey && consumerSecret) {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
      const response = await fetch(`${wpUrl}/wp-json/wc/v3/products/${id}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const product = await response.json()
        return transformWooCommerceProduct(product)
      }
    }

    // Fallback to WordPress REST API
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/products/${id}?_embed`, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      return null
    }

    const product = await response.json()
    return transformWordPressProduct(product)
  } catch (error) {
    console.error(`Error fetching WordPress product ${id}:`, error)
    return null
  }
}

/**
 * Client-side function to fetch products (for use in components)
 * Tries API route first, then falls back to direct WordPress API call
 */
export async function fetchProductsClient(): Promise<WordPressProduct[]> {
  try {
    // Try API route first (works with Next.js server)
    const response = await fetch('/api/products', {
      cache: 'no-store', // Always fetch fresh data on client
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.log('API route not available, trying direct WordPress fetch')
  }

  // Fallback: Direct WordPress API call (works with static export)
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL
    
    if (!wpUrl) {
      console.warn('WordPress URL not configured')
      return []
    }

    // Try WooCommerce first
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET

    if (consumerKey && consumerSecret) {
      // Note: In production, you should use server-side API route for security
      // Client-side credentials are exposed in the bundle
      const auth = btoa(`${consumerKey}:${consumerSecret}`)
      const response = await fetch(`${wpUrl}/wp-json/wc/v3/products`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const products = await response.json()
        return products.map(transformWooCommerceProduct)
      }
    }

    // Fallback to standard WordPress REST API
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/products?per_page=100&status=publish`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`)
    }

    const products = await response.json()
    return products.map(transformWordPressProduct)
  } catch (error) {
    console.error('Error fetching products from WordPress:', error)
    return []
  }
}

