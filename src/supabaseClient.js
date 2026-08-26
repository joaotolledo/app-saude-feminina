import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvxzgiqwegnuwipjvjzh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eHpnaXF3ZWdudXdpcGp2anpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTE3NDYsImV4cCI6MjEwMzE4Nzc0Nn0.XaBGd_zxmp5dU7hfE6Tzw9H3mCnXbATr6AFeN8vaBCQ'

export const supabase = createClient(supabaseUrl, supabaseKey)