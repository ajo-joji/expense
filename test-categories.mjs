import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials from .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Checking categories table structure...");

    // Just try to select 1 row to see the shape
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    if (error) {
        console.error("Error selecting from categories:", error);
    } else {
        console.log("Categories schema shape:", data.length > 0 ? Object.keys(data[0]) : "No data to infer shape");
    }
}

run();
