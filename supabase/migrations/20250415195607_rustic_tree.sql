/*
  # Fix Profile Table RLS Policies

  1. Changes
    - Drop existing policies for profiles table
    - Create new policies for:
      - INSERT: Allow authenticated users to create their own profile
      - SELECT: Allow users to view their own profile
      - UPDATE: Allow users to update their own profile
  
  2. Security
    - Ensures users can only access and modify their own profiles
    - Maintains RLS enabled on profiles table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);