/*
  # Community Services Platform Schema

  1. New Tables
    - `profiles`
      - Extended user profile information
      - Linked to auth.users
    - `services`
      - Available community services
      - Categories, descriptions, requirements
    - `volunteer_applications`
      - Volunteer sign-ups for services
    - `service_requests`
      - User requests for services
    
  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  bio text,
  skills text[],
  volunteer_hours int DEFAULT 0,
  is_volunteer boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  requirements text,
  volunteer_hours_reward int DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create volunteer applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id),
  volunteer_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id),
  requester_id uuid REFERENCES profiles(id),
  volunteer_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Services policies
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service creators can update their services"
  ON services FOR UPDATE
  USING (auth.uid() = created_by);

-- Volunteer applications policies
CREATE POLICY "Users can view their volunteer applications"
  ON volunteer_applications FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Users can create volunteer applications"
  ON volunteer_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = volunteer_id);

-- Service requests policies
CREATE POLICY "Users can view their service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = volunteer_id);

CREATE POLICY "Users can create service requests"
  ON service_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);