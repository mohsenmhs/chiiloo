-- Insert all static products
-- Run this SQL in Supabase SQL Editor to add all products

INSERT INTO products (name, slug, description, price, weight, grade, image, active, special) VALUES
('زعفران سرگل  ', 'زعفران-سرگل-4-6-گرم', 'زعفران سرگل ممتاز با وزن یک مثقال (4.6 گرم). بهترین قسمت گل زعفران با طعم و عطر شدید. مناسب برای غذاهای برنجی، دسرها و نوشیدنی‌های گرم.', '۱,۰۰۰,۰۰۰ تومان', '۴.۶ گرم (یک مثقال)', 'ممتاز', '/img/1.jpg', true, true),
('زعفران سرگل  ', 'زعفران-سرگل-2-گرم', 'زعفران سرگل با کیفیت عالی در بسته‌بندی دو گرمی. مناسب برای استفاده روزمره و آشپزی. طعم و رنگ اصیل زعفران را حفظ می‌کند.', '۵۵۰,۰۰۰ تومان', '۲ گرم', 'ممتاز', '/img/2.jpg', true, true),
('زعفران دخترپیچ  ', 'زعفران-دخترپیچ', 'زعفران دخترپیچ ممتاز با وزن یک مثقال (4.6 گرم). رشته‌های کامل و دستچین شده با کیفیت بالا. ایده‌آل برای مناسبت‌های خاص.', '۸۰۰,۰۰۰ تومان', '۴.۶ گرم (یک مثقال)', 'ممتاز', '/img/d.webp', true, true),
('زرشک ممتاز  ', 'زرشک-ممتاز', 'زرشک ممتاز تازه و درشت در بسته‌بندی یک کیلویی. مناسب برای تهیه زرشک پلو، آب زرشک و استفاده در غذاهای ایرانی. کیفیت عالی و طعم ترش و دلنواز.', '۸۵۰,۰۰۰ تومان', '۱ کیلوگرم', 'ممتاز', '/img/ze.jpg', true, false),
('عناب ممتاز  ', 'عناب-ممتاز', 'عناب ممتاز تازه و درشت در بسته‌بندی یک کیلویی. مناسب برای تهیه دمنوش، مربا و استفاده در غذاهای سنتی. خواص دارویی فراوان و طعم شیرین و مطبوع.', '۳۸۰,۰۰۰ تومان', '۱ کیلوگرم', 'ممتاز', '/img/a.jpg', true, false),
('حبه عناب  ', 'حبه-عناب', 'حبه عناب با کیفیت ممتاز در بسته‌بندی یک کیلویی. مناسب برای تهیه دمنوش و استفاده در طب سنتی. خواص درمانی و طعم ملایم و دلپذیر.', '۳۲۰,۰۰۰ تومان', '۱ کیلوگرم', 'ممتاز', '/img/ha.jpg', true, false)
ON CONFLICT (slug) DO NOTHING;

-- Note: 
-- - active = true: Product will be shown on products page
-- - special = true: Product will be shown on home page (in addition to being active)
-- - slug: SEO-friendly Persian URL slug (must be unique, spaces replaced with hyphens)
-- - The first 3 products (saffron) are marked as special to show on home page
-- - The last 3 products (barberry and jujube) are active but not special

