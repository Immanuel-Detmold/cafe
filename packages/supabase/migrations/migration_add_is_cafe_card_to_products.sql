-- Migration: Mark Products that are sold as Cafe Cards (vouchers)
ALTER TABLE "Products" ADD COLUMN is_cafe_card boolean NOT NULL DEFAULT false;
