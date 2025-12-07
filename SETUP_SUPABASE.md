# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be fully provisioned

## 2. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL script to create the tables and policies

## 3. Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## 4. Configure Environment Variables

Create a `.env.local` file in the root of your project with:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Insert Products

You can insert products in two ways:

### Option A: Via Supabase Dashboard
1. Go to Table Editor > products
2. Click "Insert row" and add your products manually

### Option B: Via SQL
Run this SQL in the SQL Editor (update with your actual product data):

```sql
INSERT INTO products (name, description, price, weight, grade, image) VALUES
('زعفران سرگل', 'زعفران سرگل ممتاز با وزن یک مثقال (4.6 گرم)', '۱,۰۰۰,۰۰۰ تومان', '۴.۶ گرم (یک مثقال)', 'ممتاز', '/img/1.jpg'),
('زعفران سرگل', 'زعفران سرگل با کیفیت عالی در بسته‌بندی دو گرمی', '۵۵۰,۰۰۰ تومان', '۲ گرم', 'ممتاز', '/img/2.jpg');
```

## 6. Set Up Admin Authentication (Optional)

For admin access, you can:
1. Create a user in Supabase Auth
2. Update the RLS policies to allow admin users to access all orders
3. Or use a simple password-based admin system (implemented in the admin panel)

## 7. Test the Connection

Start your development server:
```bash
npm run dev
# or
pnpm dev
```

Visit your app and check if products are loading from Supabase.

