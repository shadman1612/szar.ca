/*
  # Create Services Tables

  1. New Tables
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

-- Create services table if it doesn't exist
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

-- Create volunteer applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id),
  volunteer_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service requests table if it doesn't exist
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
DO $$ 
BEGIN
  ALTER TABLE services ENABLE ROW LEVEL SECURITY;
  ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Services policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Services are viewable by everyone'
  ) THEN
    CREATE POLICY "Services are viewable by everyone"
      ON services FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Authenticated users can create services'
  ) THEN
    CREATE POLICY "Authenticated users can create services"
      ON services FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Service creators can update their services'
  ) THEN
    CREATE POLICY "Service creators can update their services"
      ON services FOR UPDATE
      USING (auth.uid() = created_by);
  END IF;
END $$;

-- Volunteer applications policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'volunteer_applications' AND policyname = 'Users can view their volunteer applications'
  ) THEN
    CREATE POLICY "Users can view their volunteer applications"
      ON volunteer_applications FOR SELECT
      USING (auth.uid() = volunteer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'volunteer_applications' AND policyname = 'Users can create volunteer applications'
  ) THEN
    CREATE POLICY "Users can create volunteer applications"
      ON volunteer_applications FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = volunteer_id);
  END IF;
END $$;

-- Service requests policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_requests' AND policyname = 'Users can view their service requests'
  ) THEN
    CREATE POLICY "Users can view their service requests"
      ON service_requests FOR SELECT
      USING (auth.uid() = requester_id OR auth.uid() = volunteer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_requests' AND policyname = 'Users can create service requests'
  ) THEN
    CREATE POLICY "Users can create service requests"
      ON service_requests FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = requester_id);
  END IF;
END $$;