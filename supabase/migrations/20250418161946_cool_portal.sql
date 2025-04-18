/*
  # Add sponsorship applications system
  
  1. Changes
    - Add is_admin column to profiles table
    - Create sponsorship_applications table
    - Set up RLS policies for applications
    
  2. Security
    - Enable RLS
    - Add policies for creating and viewing applications
*/

-- Add is_admin column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create sponsorship applications table
CREATE TABLE IF NOT EXISTS sponsorship_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  sponsorship_type text NOT NULL,
  description text NOT NULL,
  contribution_amount text NOT NULL,
  start_date date NOT NULL,
  duration text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sponsorship_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create sponsorship applications"
  ON sponsorship_applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view sponsorship applications"
  ON sponsorship_applications FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));