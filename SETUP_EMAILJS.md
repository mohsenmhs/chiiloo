# راهنمای راه‌اندازی EmailJS

برای ارسال ایمیل سفارشات، باید EmailJS را راه‌اندازی کنید:

## مراحل راه‌اندازی:

### 1. ثبت‌نام در EmailJS
- به [https://www.emailjs.com/](https://www.emailjs.com/) بروید
- یک حساب کاربری رایگان ایجاد کنید

### 2. ایجاد Email Service
- به بخش "Email Services" بروید
- روی "Add New Service" کلیک کنید
- سرویس ایمیل خود را انتخاب کنید (Gmail، Outlook، و غیره)
- دستورالعمل‌ها را دنبال کنید تا سرویس متصل شود
- **Service ID** را یادداشت کنید

### 3. ایجاد Email Template
- به بخش "Email Templates" بروید
- روی "Create New Template" کلیک کنید
- یک قالب جدید ایجاد کنید
- در قسمت "To Email" آدرس ایمیل خود را وارد کنید: `mohsen.kh87@gmail.com`
- در قسمت "Subject" می‌توانید عنوان ایمیل را تنظیم کنید، مثلاً: `سفارش جدید از چیلو`
- در قسمت "Content" از متغیرهای زیر استفاده کنید:
  ```
  نام و نام خانوادگی: {{from_name}}
  شماره تماس: {{phone}}
  آدرس: {{address}}
  
  {{message}}
  
  مجموع سفارش: {{order_total}}
  ```
- **Template ID** را یادداشت کنید

### 4. دریافت Public Key
- به بخش "Account" > "General" بروید
- **Public Key** را کپی کنید

### 5. تنظیم متغیرهای محیطی
- یک فایل `.env.local` در ریشه پروژه ایجاد کنید
- محتوای زیر را اضافه کنید و مقادیر را جایگزین کنید:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### 6. راه‌اندازی مجدد سرور
- سرور توسعه را متوقف کنید (Ctrl+C)
- دوباره اجرا کنید: `npm run dev`

## نکات مهم:
- فایل `.env.local` را به `.gitignore` اضافه کنید (قبلاً اضافه شده)
- هرگز کلیدهای API را در کد قرار ندهید
- در حساب رایگان EmailJS، محدودیت 200 ایمیل در ماه وجود دارد

## تست
- یک سفارش تستی ایجاد کنید
- بررسی کنید که ایمیل به `mohsen.kh87@gmail.com` ارسال شده باشد

