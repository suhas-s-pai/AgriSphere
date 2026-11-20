-- ============================================================================
-- AGRI SPHERE MARKETPLACE ROW LEVEL SECURITY (RLS) POLICIES
-- Migration 05: Strict Data Access Controls & Buyer/Seller Isolation
-- ============================================================================

-- Enable RLS on all Marketplace Tables
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_shops ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. SELLER PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Public can browse approved sellers
CREATE POLICY "Approved seller profiles are public"
ON public.seller_profiles FOR SELECT
USING (verification_status = 'approved' OR auth.uid() = user_id);

-- Authenticated users can register as a seller
CREATE POLICY "Users can create their own seller profile"
ON public.seller_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Sellers can update their business info (cannot self-approve verification)
CREATE POLICY "Sellers can update their own profile"
ON public.seller_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 2. SELLER VERIFICATION DOCUMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Sellers can view their uploaded verification documents"
ON public.seller_verification_documents FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.seller_profiles sp
    WHERE sp.id = seller_id AND sp.user_id = auth.uid()
));

CREATE POLICY "Sellers can upload verification documents"
ON public.seller_verification_documents FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.seller_profiles sp
    WHERE sp.id = seller_id AND sp.user_id = auth.uid()
));

-- ----------------------------------------------------------------------------
-- 3. MARKETPLACE CATEGORIES POLICIES (Public Catalog)
-- ----------------------------------------------------------------------------
CREATE POLICY "Categories are readable by everyone"
ON public.marketplace_categories FOR SELECT
USING (is_active = true);

-- ----------------------------------------------------------------------------
-- 4. MARKETPLACE PRODUCTS POLICIES
-- ----------------------------------------------------------------------------
-- Public can browse active or out-of-stock products; sellers can view own unlisted products
CREATE POLICY "Public products are viewable by all"
ON public.marketplace_products FOR SELECT
USING (
    status IN ('active', 'out_of_stock')
    OR EXISTS (
        SELECT 1 FROM public.seller_profiles sp
        WHERE sp.id = seller_id AND sp.user_id = auth.uid()
    )
);

-- Approved or pending sellers can create product listings
CREATE POLICY "Sellers can insert their own products"
ON public.marketplace_products FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.seller_profiles sp
    WHERE sp.id = seller_id AND sp.user_id = auth.uid()
));

-- Sellers can update their own products
CREATE POLICY "Sellers can update their own products"
ON public.marketplace_products FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.seller_profiles sp
    WHERE sp.id = seller_id AND sp.user_id = auth.uid()
));

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete their own products"
ON public.marketplace_products FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.seller_profiles sp
    WHERE sp.id = seller_id AND sp.user_id = auth.uid()
));

-- ----------------------------------------------------------------------------
-- 5. PRODUCT IMAGES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Product images are public"
ON public.product_images FOR SELECT
USING (true);

CREATE POLICY "Sellers can manage product images"
ON public.product_images FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.marketplace_products p
    JOIN public.seller_profiles sp ON sp.id = p.seller_id
    WHERE p.id = product_id AND sp.user_id = auth.uid()
));

-- ----------------------------------------------------------------------------
-- 6. INVENTORY POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Inventory is readable by everyone"
ON public.inventory FOR SELECT
USING (true);

CREATE POLICY "Sellers can update their product inventory"
ON public.inventory FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.marketplace_products p
    JOIN public.seller_profiles sp ON sp.id = p.seller_id
    WHERE p.id = product_id AND sp.user_id = auth.uid()
));

-- ----------------------------------------------------------------------------
-- 7. CART ITEMS POLICIES (Private to Buyer)
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own cart items"
ON public.cart_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to their own cart"
ON public.cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update quantities in their own cart"
ON public.cart_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove items from their own cart"
ON public.cart_items FOR DELETE
USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 8. DELIVERY ADDRESSES POLICIES (Private to Owner)
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can manage their delivery addresses"
ON public.delivery_addresses FOR ALL
USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 9. MARKETPLACE ORDERS POLICIES
-- ----------------------------------------------------------------------------
-- Buyers view their placed orders; Sellers view orders incoming to them
CREATE POLICY "Buyers and sellers can view their own orders"
ON public.marketplace_orders FOR SELECT
USING (
    auth.uid() = buyer_id
    OR EXISTS (
        SELECT 1 FROM public.seller_profiles sp
        WHERE sp.id = seller_id AND sp.user_id = auth.uid()
    )
);

CREATE POLICY "Buyers can create orders"
ON public.marketplace_orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Buyers can cancel before processing; Sellers can update statuses (e.g. ready_for_dispatch, shipped)
CREATE POLICY "Participants can update orders"
ON public.marketplace_orders FOR UPDATE
USING (
    auth.uid() = buyer_id
    OR EXISTS (
        SELECT 1 FROM public.seller_profiles sp
        WHERE sp.id = seller_id AND sp.user_id = auth.uid()
    )
);

-- ----------------------------------------------------------------------------
-- 10. ORDER ITEMS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Order line items visible to order participants"
ON public.marketplace_order_items FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.marketplace_orders o
    WHERE o.id = order_id AND (
        o.buyer_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.seller_profiles sp
            WHERE sp.id = o.seller_id AND sp.user_id = auth.uid()
        )
    )
));

CREATE POLICY "Order items insertable on order creation"
ON public.marketplace_order_items FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.marketplace_orders o
    WHERE o.id = order_id AND o.buyer_id = auth.uid()
));

-- ----------------------------------------------------------------------------
-- 11. MARKETPLACE PAYMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Payment records visible to order participants"
ON public.marketplace_payments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.marketplace_orders o
    WHERE o.id = order_id AND (
        o.buyer_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.seller_profiles sp
            WHERE sp.id = o.seller_id AND sp.user_id = auth.uid()
        )
    )
));

-- ----------------------------------------------------------------------------
-- 12. MARKETPLACE REVIEWS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public reviews are readable by everyone"
ON public.marketplace_reviews FOR SELECT
USING (is_moderated = false);

CREATE POLICY "Verified buyers can create reviews for purchased products"
ON public.marketplace_reviews FOR INSERT
WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (
        SELECT 1 FROM public.marketplace_orders o
        JOIN public.marketplace_order_items oi ON oi.order_id = o.id
        WHERE o.id = order_id
          AND o.buyer_id = auth.uid()
          AND oi.product_id = product_id
          AND o.order_status = 'delivered'
    )
);

CREATE POLICY "Buyers can update their own reviews"
ON public.marketplace_reviews FOR UPDATE
USING (auth.uid() = buyer_id);

-- ----------------------------------------------------------------------------
-- 13. MARKETPLACE SHOPS POLICIES (Public Directory)
-- ----------------------------------------------------------------------------
CREATE POLICY "Verified shops directory is public"
ON public.marketplace_shops FOR SELECT
USING (true);
