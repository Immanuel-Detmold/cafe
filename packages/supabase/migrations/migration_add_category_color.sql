-- Migration: Add color column to ProductCategories
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

ALTER TABLE public."ProductCategories"
ADD COLUMN color text;
