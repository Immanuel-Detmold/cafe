-- Migration: Rename payment_method 'voucher' → 'free_drink' in Orders table
UPDATE "Orders"
SET payment_method = 'free_drink'
WHERE payment_method = 'voucher';
