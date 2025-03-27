-- Create auth schema if not exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users table if not exists
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid NOT NULL PRIMARY KEY,
  email text,
  raw_user_meta_data jsonb
);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Everyone can view plans" ON plans;
DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;
DROP POLICY IF EXISTS "Users can view their own colors" ON colors;
DROP POLICY IF EXISTS "Users can insert their own colors" ON colors;
DROP POLICY IF EXISTS "Users can update their own colors" ON colors;
DROP POLICY IF EXISTS "Users can delete their own colors" ON colors;
DROP POLICY IF EXISTS "Users can view their own sizes" ON sizes;
DROP POLICY IF EXISTS "Users can insert their own sizes" ON sizes;
DROP POLICY IF EXISTS "Users can update their own sizes" ON sizes;
DROP POLICY IF EXISTS "Users can delete their own sizes" ON sizes;
DROP POLICY IF EXISTS "Users can view their own materials" ON materials;
DROP POLICY IF EXISTS "Users can insert their own materials" ON materials;
DROP POLICY IF EXISTS "Users can update their own materials" ON materials;
DROP POLICY IF EXISTS "Users can delete their own materials" ON materials;
DROP POLICY IF EXISTS "Users can view their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can insert their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can update their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can delete their own suppliers" ON suppliers;
DROP POLICY IF EXISTS "Users can view their own products" ON products;
DROP POLICY IF EXISTS "Users can insert their own products" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;
DROP POLICY IF EXISTS "Users can delete their own products" ON products;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Users can delete their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can update their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can delete their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own settings" ON settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON settings;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_ColorToProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_MaterialToProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_ProductToSize" ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid()::text = id::text);

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid()::text = "userId"::text);

-- Create policies for plans
CREATE POLICY "Everyone can view plans"
  ON plans FOR SELECT
  USING (true);

-- Create policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid()::text = "userId"::text);

-- Create policies for categories
CREATE POLICY "Users can view their own categories"
  ON categories FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own categories"
  ON categories FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create policies for colors
CREATE POLICY "Users can view their own colors"
  ON colors FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own colors"
  ON colors FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own colors"
  ON colors FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own colors"
  ON colors FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create policies for sizes
CREATE POLICY "Users can view their own sizes"
  ON sizes FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own sizes"
  ON sizes FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own sizes"
  ON sizes FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own sizes"
  ON sizes FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create policies for materials
CREATE POLICY "Users can view their own materials"
  ON materials FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own materials"
  ON materials FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own materials"
  ON materials FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own materials"
  ON materials FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create policies for suppliers
CREATE POLICY "Users can view their own suppliers"
  ON suppliers FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own suppliers"
  ON suppliers FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own suppliers"
  ON suppliers FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own suppliers"
  ON suppliers FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create policies for products
CREATE POLICY "Users can view their own products"
  ON products FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own orders"
  ON orders FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create policies for order items
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items."orderId"
    AND auth.uid()::text = orders."userId"::text
  ));

CREATE POLICY "Users can insert their own order items"
  ON order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = "orderId"
    AND auth.uid()::text = orders."userId"::text
  ));

CREATE POLICY "Users can update their own order items"
  ON order_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items."orderId"
    AND auth.uid()::text = orders."userId"::text
  ));

CREATE POLICY "Users can delete their own order items"
  ON order_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items."orderId"
    AND auth.uid()::text = orders."userId"::text
  ));

-- Create policies for junction tables
CREATE POLICY "Users can access their product colors"
  ON "_ColorToProduct" FOR ALL
  USING (EXISTS (
    SELECT 1 FROM products
    WHERE products.id = "_ColorToProduct"."B"
    AND auth.uid()::text = products."userId"::text
  ));

CREATE POLICY "Users can access their product materials"
  ON "_MaterialToProduct" FOR ALL
  USING (EXISTS (
    SELECT 1 FROM products
    WHERE products.id = "_MaterialToProduct"."B"
    AND auth.uid()::text = products."userId"::text
  ));

CREATE POLICY "Users can access their product sizes"
  ON "_ProductToSize" FOR ALL
  USING (EXISTS (
    SELECT 1 FROM products
    WHERE products.id = "_ProductToSize"."A"
    AND auth.uid()::text = products."userId"::text
  ));

-- Create policies for settings
CREATE POLICY "Users can view their own settings"
  ON settings FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert their own settings"
  ON settings FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own settings"
  ON settings FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own settings"
  ON settings FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- Create auth functions
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    (current_setting('request.jwt.claims', true)::json->>'userId')::text
  )::uuid;
$$ LANGUAGE SQL;

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, last_login)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create cascade delete trigger for user deletion
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete all related data
    DELETE FROM settings WHERE "userId" = OLD.id;
    DELETE FROM order_items WHERE "orderId" IN (SELECT id FROM orders WHERE "userId" = OLD.id);
    DELETE FROM orders WHERE "userId" = OLD.id;
    DELETE FROM products WHERE "userId" = OLD.id;
    DELETE FROM suppliers WHERE "userId" = OLD.id;
    DELETE FROM materials WHERE "userId" = OLD.id;
    DELETE FROM sizes WHERE "userId" = OLD.id;
    DELETE FROM colors WHERE "userId" = OLD.id;
    DELETE FROM categories WHERE "userId" = OLD.id;
    DELETE FROM invoices WHERE "userId" = OLD.id;
    DELETE FROM subscriptions WHERE "userId" = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_deleted
    BEFORE DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_deleted_user(); 