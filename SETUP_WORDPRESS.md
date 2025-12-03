# WordPress Backend Integration Setup

This guide will help you connect your Next.js store to WordPress as a backend.

## Prerequisites

1. A WordPress installation (self-hosted or WordPress.com)
2. Optional: WooCommerce plugin if you want to use WooCommerce products

## Setup Options

### Option 1: Standard WordPress REST API (Recommended for simple setups)

1. **Enable WordPress REST API**
   - The REST API is enabled by default in WordPress 4.7+
   - Make sure your WordPress site is accessible

2. **Create a Custom Post Type for Products (Optional)**
   - Install a plugin like "Custom Post Type UI" or "ACF" (Advanced Custom Fields)
   - Create a post type called "products"
   - Add custom fields: `price`, `weight`, `grade`
   - Or use ACF to create these fields

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_WORDPRESS_URL` to your WordPress site URL:
     ```
     NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
     ```

4. **WordPress Custom Post Type Setup**
   If you're using a custom post type, you may need to register it in WordPress. Add this to your theme's `functions.php`:

   ```php
   function register_products_post_type() {
       register_post_type('products',
           array(
               'public' => true,
               'show_in_rest' => true, // Important: enables REST API
               'supports' => array('title', 'editor', 'thumbnail'),
               'labels' => array(
                   'name' => 'Products',
                   'singular_name' => 'Product'
               )
           )
       );
   }
   add_action('init', 'register_products_post_type');
   ```

### Option 2: WooCommerce Integration (Recommended for e-commerce)

1. **Install WooCommerce**
   - Install and activate WooCommerce plugin on your WordPress site
   - Complete the WooCommerce setup wizard

2. **Generate REST API Credentials**
   - Go to: WooCommerce > Settings > Advanced > REST API
   - Click "Add Key"
   - Description: "Next.js Store"
   - User: Select an administrator user
   - Permissions: Read
   - Click "Generate API Key"
   - Copy the Consumer Key and Consumer Secret

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Set your WordPress URL:
     ```
     NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
     ```
   - Add WooCommerce credentials:
     ```
     WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
     WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here
     ```

4. **Product Setup in WooCommerce**
   - Add products in WooCommerce: Products > Add New
   - Set product name, description, price, and featured image
   - For custom fields like `weight` and `grade`, you can:
     - Use WooCommerce product meta fields
     - Install a plugin like "Advanced Custom Fields" (ACF)
     - Use product attributes or custom fields

## Product Data Mapping

The integration expects products with the following fields:

- **id**: Product ID (automatically provided)
- **name**: Product name/title
- **description**: Product description
- **price**: Product price (formatted as Persian/Farsi)
- **weight**: Product weight (optional)
- **grade**: Product grade/quality (optional)
- **image**: Product featured image URL

### For WooCommerce:
- Price is automatically extracted from WooCommerce price fields
- Weight can be set in product meta or custom fields
- Grade can be set in product meta, categories, or custom fields

### For Standard WordPress:
- Use ACF (Advanced Custom Fields) plugin to add custom fields
- Or use post meta fields
- Featured image is automatically used

## Testing the Integration

1. **Start your Next.js development server:**
   ```bash
   npm run dev
   ```

2. **Check the browser console** for any errors

3. **Visit `/products` page** to see if products load from WordPress

4. **If products don't load:**
   - Check that your WordPress URL is correct
   - Verify REST API is accessible: `https://your-wordpress-site.com/wp-json/wp/v2/products`
   - For WooCommerce: `https://your-wordpress-site.com/wp-json/wc/v3/products`
   - Check browser console and server logs for errors

## Troubleshooting

### Products not loading
- Verify `NEXT_PUBLIC_WORDPRESS_URL` is set correctly
- Check WordPress REST API is accessible (visit the API URL in browser)
- Ensure products are published in WordPress
- Check CORS settings if WordPress is on a different domain

### Images not showing
- Ensure featured images are set in WordPress
- Check image URLs are accessible
- Verify `next.config.js` has proper image configuration

### WooCommerce authentication errors
- Verify Consumer Key and Secret are correct
- Ensure the API key has "Read" permissions
- Check that the user associated with the key has proper permissions

### CORS Issues
If WordPress is on a different domain, you may need to add CORS headers. Add this to your WordPress theme's `functions.php`:

```php
function add_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('init', 'add_cors_headers');
```

Or use a plugin like "CORS Headers" for WordPress.

## Fallback Behavior

If WordPress is not configured or products cannot be fetched, the store will automatically fall back to using the local `data/products.json` file. This ensures your store continues to work during setup or if WordPress is temporarily unavailable.

## Next Steps

- Customize product fields in WordPress to match your needs
- Set up product categories in WordPress
- Configure product images and galleries
- Add more custom fields as needed (stock, SKU, etc.)

