/*
  # Add fields to volunteer applications

  1. Changes
    - Add experience, availability, and motivation fields to volunteer_applications table
    
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE volunteer_applications
ADD COLUMN IF NOT EXISTS experience text,
ADD COLUMN IF NOT EXISTS availability text,
ADD COLUMN IF NOT EXISTS motivation text;