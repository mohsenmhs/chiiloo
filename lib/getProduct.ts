import { supabase, Product } from './supabase'

// Map image paths from database to actual image paths
// Since images are in assets/img/ and referenced as /img/ in database,
// we need to map them correctly for static export
// For server-side rendering, we'll return the path as-is and let Next.js handle it
const imageMap: { [key: string]: string } = {
  '/img/1.jpg': '/img/1.jpg',
  '/img/2.jpg': '/img/2.jpg',
  '/img/d.webp': '/img/d.webp',
  '/img/ze.jpg': '/img/ze.jpg',
  '/img/a.jpg': '/img/a.jpg',
  '/img/ha.jpg': '/img/ha.jpg',
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Decode the slug in case it's URL-encoded (Next.js handles this, but we ensure it works)
    let decodedSlug = slug
    try {
      decodedSlug = decodeURIComponent(slug)
    } catch (e) {
      // If decoding fails, use the original slug
      decodedSlug = slug
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', decodedSlug)
      .eq('active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Map image to local asset
    const mappedImage = imageMap[data.image] || data.image

    return {
      ...data,
      image: mappedImage
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    return null
  }
}

// Keep for backward compatibility
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Map image to local asset
    const mappedImage = imageMap[data.image] || data.image

    return {
      ...data,
      image: mappedImage
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    return null
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug')
      .eq('active', true)

    if (error) {
      console.error('Error fetching product slugs:', error)
      return []
    }

    const slugs = (data || []).map(product => product.slug).filter(Boolean)
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetched product slugs:', slugs)
    }
    
    return slugs
  } catch (err) {
    console.error('Error fetching product slugs:', err)
    return []
  }
}

