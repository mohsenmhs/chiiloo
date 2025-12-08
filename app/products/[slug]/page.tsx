import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProductSlugs } from '@/lib/getProduct'
import ProductDetail from '@/components/ProductDetail'

interface PageProps {
  params: {
    slug: string
  }
}

// Fallback slugs if database is not accessible during build
const FALLBACK_SLUGS = [
  'زعفران-سرگل-4-6-گرم',
  'زعفران-سرگل-2-گرم',
  'زعفران-دخترپیچ',
  'زرشک-ممتاز',
  'عناب-ممتاز',
  'حبه-عناب',
]

export async function generateStaticParams() {
  try {
    const productSlugs = await getAllProductSlugs()
    
    // Log for debugging
    console.log('Generating static params for slugs:', productSlugs)
    console.log('Number of slugs:', productSlugs.length)
    
    // Use database slugs if available, otherwise use fallback
    const slugsToUse = productSlugs.length > 0 ? productSlugs : FALLBACK_SLUGS
    
    if (slugsToUse.length === 0) {
      console.warn('No product slugs available. Using empty array.')
      return []
    }
    
    // For static export with Persian characters, Next.js URL-encodes the slugs
    // when creating file paths. We need to return URL-encoded slugs to match
    // what Next.js expects during static generation.
    return slugsToUse.map((slug) => {
      // Ensure slug is a string and not null/undefined
      if (!slug || typeof slug !== 'string') {
        console.warn('Invalid slug found:', slug)
        return null
      }
      const trimmedSlug = slug.trim()
      
      // URL-encode the slug to match what Next.js uses for file paths
      // This ensures generateStaticParams returns the same format Next.js expects
      const encodedSlug = encodeURIComponent(trimmedSlug)
      
      return {
        slug: encodedSlug,
      }
    }).filter(Boolean) as { slug: string }[]
  } catch (error) {
    console.error('Error generating static params:', error)
    console.log('Using fallback slugs due to error')
    // Use fallback slugs if database query fails
    return FALLBACK_SLUGS.map((slug) => ({
      slug: slug.trim(),
    }))
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Decode the slug in case it's URL-encoded
  let decodedSlug = params.slug
  try {
    decodedSlug = decodeURIComponent(params.slug)
  } catch (e) {
    // If decoding fails, use the original slug
    decodedSlug = params.slug
  }
  
  const product = await getProductBySlug(decodedSlug)

  if (!product) {
    return {
      title: 'محصول یافت نشد | چیلو',
    }
  }

  const title = `${product.name} | چیلو - زعفران ممتاز`
  const description = product.description || `خرید ${product.name} با کیفیت ممتاز از چیلو`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  // Decode the slug in case it's URL-encoded
  let decodedSlug = params.slug
  try {
    decodedSlug = decodeURIComponent(params.slug)
  } catch (e) {
    // If decoding fails, use the original slug
    decodedSlug = params.slug
  }
  
  const product = await getProductBySlug(decodedSlug)

  if (!product) {
    notFound()
  }

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'چیلو'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IRR',
      availability: product.active ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  )
}

