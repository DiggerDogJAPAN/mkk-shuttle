-- Enable Row Level Security on the bookings table (if not already enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 1. Policy to allow authenticated users to INSERT their own bookings
-- This ensures a user can only create a booking where user_id matches their auth.uid()
CREATE POLICY "Users can insert their own bookings"
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. Policy to allow authenticated users to SELECT their own bookings
-- This is critical so that after inserting, Supabase can return the newly created row
CREATE POLICY "Users can view their own bookings"
ON bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Policy to allow admin users to SELECT all bookings (Bonus security setup)
CREATE POLICY "Admins can view all bookings"
ON bookings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
