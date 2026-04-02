-- Migration: Add sort_order column to ProductCategories and clean up number prefixes
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Step 1: Add sort_order column
ALTER TABLE public."ProductCategories"
ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Step 2: Set sort_order from existing numeric prefix AND strip prefix from category name
UPDATE public."ProductCategories"
SET sort_order = CAST(substring(category from '^(\d+)') AS integer),
    category = regexp_replace(category, '^\d+-', '')
WHERE category ~ '^\d+-';

-- Step 3: For categories WITHOUT a number prefix, assign sort_order based on alphabetical order
-- (This ensures all categories have a meaningful sort_order)
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order, category) - 1 AS new_order
  FROM public."ProductCategories"
)
UPDATE public."ProductCategories" c
SET sort_order = ordered.new_order
FROM ordered
WHERE c.id = ordered.id;

-- Step 4: Strip number prefix from Products.category to match cleaned category names
UPDATE public."Products"
SET category = regexp_replace(category, '^\d+-', '')
WHERE category ~ '^\d+-';

-- Verify results:
SELECT id, category, sort_order FROM public."ProductCategories" ORDER BY sort_order;
SELECT DISTINCT category FROM public."Products" ORDER BY category;
