const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1]] = match[2];
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials from .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Checking categories table structure...");

    // Try to select categories
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    if (error) {
        console.error("Error selecting from categories:", error);
    } else {
        console.log("Categories data:", data);
    }

    // To test insertion, we'd need a real user UUID. 
    // Let's get the first user from auth.users via an RPC if we had it, or just query profiles.
    const { data: profiles, error: pError } = await supabase.from('profiles').select('id').limit(1);
    if (pError) {
        console.error("Error fetching profile:", pError);
        return;
    }

    if (profiles.length > 0) {
        const uid = profiles[0].id;
        console.log("Found a user ID to test insert:", uid);

        const defaultCategories = [
            { user_id: uid, name: "Groceries", color: "#10b981", icon: "shopping-cart" }
        ];

        const { data: insertedData, error: insertError } = await supabase
            .from("categories")
            .insert(defaultCategories)
            .select();

        console.log("Insert result:", { insertedData, insertError });
    } else {
        console.log("No profiles found. Has the user created an account?");
    }
}

run();
