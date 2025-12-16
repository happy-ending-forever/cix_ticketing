import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tikcqwmzfjyqodivtxkz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpa2Nxd216Zmp5cW9kaXZ0eGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NTk5ODQsImV4cCI6MjA4MTQzNTk4NH0.Qh3Ifz_10WUwM-eAfoIJsl4uHv50Kij5WigYQjHg2dk';

export const supabase = createClient(supabaseUrl, supabaseKey);