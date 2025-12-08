-- Migration script to add slug column to existing products table
-- Run this SQL in Supabase SQL Editor if you have an existing database

-- Add slug column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Generate Persian slugs for existing products based on their name
-- Replace spaces with hyphens and remove special characters
UPDATE products 
SET slug = CASE 
  WHEN id = 3 THEN 'زعفران-سرگل-4-6-گرم'
  WHEN id = 4 THEN 'زعفران-سرگل-2-گرم'
  WHEN id = 5 THEN 'زعفران-دخترپیچ'
  WHEN id = 6 THEN 'زرشک-ممتاز'
  WHEN id = 7 THEN 'عناب-ممتاز'
  WHEN id = 8 THEN 'حبه-عناب'
  ELSE REPLACE(TRIM(name), ' ', '-') || '-' || id::TEXT
END
WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing data
ALTER TABLE products 
ALTER COLUMN slug SET NOT NULL;

