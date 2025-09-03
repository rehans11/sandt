// Supabase Configuration
const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase project credentials
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
