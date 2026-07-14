-- Migration: Mark Products that should be shown on the public Menu Card
ALTER TABLE "Products" ADD COLUMN show_on_menu boolean NOT NULL DEFAULT true;
