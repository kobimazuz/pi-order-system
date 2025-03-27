-- Create auth schema and functions
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users table if not exists
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid NOT NULL PRIMARY KEY,
  email text,
  raw_user_meta_data jsonb
);

-- Create auth functions
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    (current_setting('request.jwt.claims', true)::json->>'userId')::text
  )::uuid;
$$ LANGUAGE SQL;

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "company_name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "features" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3) NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex_code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "units_per_pack" INTEGER NOT NULL,
    "packing_info" TEXT,
    "units_per_carton" INTEGER NOT NULL,
    "price_per_unit" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "categoryId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "pi_number" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "total_items" INTEGER NOT NULL DEFAULT 0,
    "total_units" INTEGER NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_units" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "piPrefix" TEXT NOT NULL DEFAULT 'PI-',
    "piFormat" TEXT NOT NULL DEFAULT 'YYYY-NNNN',
    "piFooter" TEXT,
    "dbHost" TEXT NOT NULL DEFAULT 'localhost',
    "dbPort" TEXT NOT NULL DEFAULT '5432',
    "dbName" TEXT NOT NULL DEFAULT 'pi_system',
    "dbSchema" TEXT NOT NULL DEFAULT 'public',
    "dbUser" TEXT NOT NULL DEFAULT 'postgres',
    "dbPassword" TEXT NOT NULL,
    "excelTemplate" TEXT NOT NULL DEFAULT 'pi_template.xlsx',
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "showStatistics" BOOLEAN NOT NULL DEFAULT true,
    "systemNotifications" BOOLEAN NOT NULL DEFAULT true,
    "resetNumbering" BOOLEAN NOT NULL DEFAULT true,
    "includeProductImages" BOOLEAN NOT NULL DEFAULT true,
    "includeCompanyLogo" BOOLEAN NOT NULL DEFAULT true,
    "saveLocalCopy" BOOLEAN NOT NULL DEFAULT true,
    "exportPath" TEXT NOT NULL DEFAULT '/exports',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ColorToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ColorToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MaterialToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_MaterialToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductToSize" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProductToSize_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_code_key" ON "categories"("userId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "colors_userId_code_key" ON "colors"("userId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_userId_code_key" ON "sizes"("userId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "materials_userId_code_key" ON "materials"("userId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_userId_code_key" ON "suppliers"("userId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "products_userId_sku_key" ON "products"("userId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "orders_pi_number_key" ON "orders"("pi_number");

-- CreateIndex
CREATE INDEX "_ColorToProduct_B_index" ON "_ColorToProduct"("B");

-- CreateIndex
CREATE INDEX "_MaterialToProduct_B_index" ON "_MaterialToProduct"("B");

-- CreateIndex
CREATE INDEX "_ProductToSize_B_index" ON "_ProductToSize"("B");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colors" ADD CONSTRAINT "colors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToProduct" ADD CONSTRAINT "_ColorToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToProduct" ADD CONSTRAINT "_ColorToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToProduct" ADD CONSTRAINT "_MaterialToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToProduct" ADD CONSTRAINT "_MaterialToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSize" ADD CONSTRAINT "_ProductToSize_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSize" ADD CONSTRAINT "_ProductToSize_B_fkey" FOREIGN KEY ("B") REFERENCES "sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "colors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sizes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "materials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "suppliers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON "profiles"
    FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
    ON "profiles"
    FOR UPDATE
    USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own subscription"
    ON "subscriptions"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own subscription"
    ON "subscriptions"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Anyone can view plans"
    ON "plans"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view their own invoices"
    ON "invoices"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their own categories"
    ON "categories"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create their own categories"
    ON "categories"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own categories"
    ON "categories"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own categories"
    ON "categories"
    FOR DELETE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their own colors"
    ON "colors"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create their own colors"
    ON "colors"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own colors"
    ON "colors"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own colors"
    ON "colors"
    FOR DELETE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their own sizes"
    ON "sizes"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create their own sizes"
    ON "sizes"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own sizes"
    ON "sizes"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own sizes"
    ON "sizes"
    FOR DELETE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their own materials"
    ON "materials"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create their own materials"
    ON "materials"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own materials"
    ON "materials"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own materials"
    ON "materials"
    FOR DELETE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their own suppliers"
    ON "suppliers"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create their own suppliers"
    ON "suppliers"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own suppliers"
    ON "suppliers"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own suppliers"
    ON "suppliers"
    FOR DELETE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their own products"
    ON "products"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create their own products"
    ON "products"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own products"
    ON "products"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own products"
    ON "products"
    FOR DELETE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their own orders"
    ON "orders"
    FOR SELECT
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create their own orders"
    ON "orders"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own orders"
    ON "orders"
    FOR UPDATE
    USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view their order items"
    ON "order_items"
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM "orders"
        WHERE "orders".id = "order_items"."orderId"
        AND "orders"."userId"::text = auth.uid()::text
    ));

CREATE POLICY "Users can create order items in their orders"
    ON "order_items"
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM "orders"
        WHERE "orders".id = "orderId"
        AND "orders"."userId"::text = auth.uid()::text
    ));

CREATE POLICY "Users can update their order items"
    ON "order_items"
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM "orders"
        WHERE "orders".id = "order_items"."orderId"
        AND "orders"."userId"::text = auth.uid()::text
    ));

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public."profiles" (id, email, created_at, last_login)
    VALUES (
        new.id,
        new.email,
        new.created_at,
        new.created_at
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
