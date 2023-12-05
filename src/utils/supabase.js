import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqhsqviizovvqbyvfgvi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxaHNxdmlpem92dnFieXZmZ3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1NTY3MjIsImV4cCI6MjAxNzEzMjcyMn0.garalBm8ifUa48v2axI7hAR5Q_QxAFL_WzRNeRgIlaw';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const auth = supabase.auth;