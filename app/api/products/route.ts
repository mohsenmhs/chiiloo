import { NextResponse } from 'next/server'
import { fetchWordPressProducts } from '@/lib/wordpress'

/**
 * API Route for fetching products from WordPress
 * This allows server-side fetching and caching
 */
export async function GET() {
  try {
    const products = await fetchWordPressProducts()
    
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error in products API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

