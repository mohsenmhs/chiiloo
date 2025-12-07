# چیلو - فروشگاه زعفران ممتاز

یک وب‌سایت Next.js برای فروشگاه زعفران با طراحی فارسی و راست‌به‌چپ و پشتیبانی کامل از Supabase برای مدیریت محصولات و سفارشات.

## ویژگی‌ها

- ✅ طراحی فارسی و راست‌به‌چپ (RTL)
- ✅ صفحه اصلی، درباره ما، و محصولات
- ✅ سبد خرید با مدیریت وضعیت
- ✅ اتصال به Supabase برای مدیریت محصولات و سفارشات
- ✅ ثبت سفارش در دیتابیس Supabase
- ✅ پیگیری سفارش با کد پیگیری یا شماره تماس
- ✅ پنل مدیریت برای مشاهده و مدیریت سفارشات
- ✅ به‌روزرسانی وضعیت سفارش در پنل مدیریت
- ✅ فرم سفارش با ارسال ایمیل (اختیاری)
- ✅ بهینه‌سازی شده برای SEO
- ✅ طراحی واکنش‌گرا (Responsive)
- ✅ رنگ‌بندی قرمز، بنفش و زرد

## نصب و راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
npm install
# یا
pnpm install
```

### 2. راه‌اندازی Supabase

برای راه‌اندازی Supabase و اتصال به دیتابیس، لطفاً فایل `SETUP_SUPABASE.md` را مطالعه کنید.

**مراحل کلی:**
1. ایجاد پروژه در Supabase
2. اجرای اسکریپت SQL در `supabase/schema.sql`
3. ایجاد فایل `.env.local` با اطلاعات Supabase
4. وارد کردن محصولات به دیتابیس

### 3. راه‌اندازی EmailJS (اختیاری - برای ارسال ایمیل سفارشات)

برای فعال‌سازی ارسال ایمیل سفارشات، لطفاً فایل `SETUP_EMAILJS.md` را مطالعه کنید.

### 4. اجرای پروژه

```bash
npm run dev
# یا
pnpm dev
```

سایت در آدرس `http://localhost:3000` در دسترس خواهد بود.

### 5. ساخت نسخه Production

```bash
npm run build
npm run start
```

## ساختار پروژه

```
chiiloo/
├── app/                 # صفحات Next.js
│   ├── page.tsx         # صفحه اصلی
│   ├── about/           # صفحه درباره ما
│   ├── products/        # صفحه محصولات
│   ├── cart/            # صفحه سبد خرید
│   ├── track/           # صفحه پیگیری سفارش
│   └── admin/           # پنل مدیریت
│       ├── login/       # صفحه ورود ادمین
│       └── page.tsx      # داشبورد مدیریت
├── components/          # کامپوننت‌های قابل استفاده مجدد
├── contexts/            # Context API برای مدیریت وضعیت
├── lib/                 # کتابخانه‌ها و utilities
│   ├── supabase.ts      # تنظیمات Supabase
│   └── hooks/           # Custom hooks
├── supabase/            # اسکریپت‌های دیتابیس
│   └── schema.sql       # ساختار دیتابیس
└── public/              # فایل‌های استاتیک
```

## تکنولوژی‌ها

- Next.js 14
- React 18
- TypeScript
- CSS Modules
- Supabase (برای دیتابیس و Backend)
- EmailJS (اختیاری - برای ارسال ایمیل)

## صفحات و قابلیت‌ها

### صفحات عمومی
- **خانه** (`/`): صفحه اصلی با نمایش محصولات برتر
- **محصولات** (`/products`): لیست کامل محصولات
- **درباره ما** (`/about`): اطلاعات درباره فروشگاه
- **سبد خرید** (`/cart`): مدیریت سبد خرید و ثبت سفارش
- **پیگیری سفارش** (`/track`): جستجوی سفارش با کد پیگیری یا شماره تماس

### پنل مدیریت
- **ورود** (`/admin/login`): صفحه ورود به پنل مدیریت
- **داشبورد** (`/admin`): مشاهده و مدیریت تمام سفارشات

## متغیرهای محیطی

فایل `.env.local` را با محتوای زیر ایجاد کنید:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# اختیاری - برای ارسال ایمیل
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# برای پنل مدیریت
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

## پشتیبانی

- برای راه‌اندازی Supabase، فایل `SETUP_SUPABASE.md` را مطالعه کنید.
- برای راه‌اندازی EmailJS، فایل `SETUP_EMAILJS.md` را مطالعه کنید.
