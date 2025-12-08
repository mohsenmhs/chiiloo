// Utility function to generate URL-friendly Persian slugs
// Persian characters are valid in URLs when properly encoded

export function generateSlug(text: string): string {
  // Remove extra spaces and trim
  let slug = text.trim()
  
  // Remove leading/trailing spaces from the name
  slug = slug.replace(/^\s+|\s+$/g, '')
  
  // Replace multiple spaces with single space
  slug = slug.replace(/\s+/g, ' ')
  
  // Replace spaces with hyphens for URL-friendly format
  slug = slug.replace(/\s/g, '-')
  
  // Remove special characters that aren't URL-safe (keep Persian/Arabic characters)
  // Remove: ! @ # $ % ^ & * ( ) + = [ ] { } | \ : ; " ' < > , . ? /
  slug = slug.replace(/[!@#$%^&*()+=\[\]{}|\\:;"'<>,.?/]/g, '')
  
  // Replace multiple hyphens with single hyphen
  slug = slug.replace(/-+/g, '-')
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '')
  
  return slug || 'محصول'
}

// Generate slug from product name and ID for uniqueness
export function generateProductSlug(name: string, id: number): string {
  const nameSlug = generateSlug(name)
  // If slug is empty, use ID
  if (!nameSlug || nameSlug.length < 2) {
    return `محصول-${id}`
  }
  // Combine name slug with ID for uniqueness
  return `${nameSlug}-${id}`
}

