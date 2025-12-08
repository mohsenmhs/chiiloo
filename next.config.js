/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Disable static optimization for dynamic routes to avoid encoding issues
  // This allows Next.js to handle Persian characters in URLs properly
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig

