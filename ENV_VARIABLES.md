# Environment Variables Reference

Create a `.env.local` file in the root of your project with the following variables:

## Required for WordPress Integration

```bash
# Your WordPress site URL (without trailing slash)
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
```

## Optional: WooCommerce Integration

```bash
# WooCommerce REST API credentials
# Generate these in WordPress: WooCommerce > Settings > Advanced > REST API
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# Note: For better security, use server-side API routes instead of exposing
# these credentials in NEXT_PUBLIC_ variables. The current implementation
# uses server-side API routes by default.
```

## EmailJS Configuration (Existing)

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Variables without `NEXT_PUBLIC_` are only available on the server
- Never commit `.env.local` to version control
- Use `.env.example` as a template (if it exists)

