import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types";

export async function getCategories() {
    const supabase = createClient();

    // Explicitly need user ID to seed defaults
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (error) throw error;

    // Auto-seed missing default categories
    const defaultCategoriesList = [
        { name: "Groceries", color: "#10b981", icon: "shopping-cart" },
        { name: "Food & Dining", color: "#f59e0b", icon: "utensils" },
        { name: "Travel", color: "#3b82f6", icon: "plane" },
        { name: "Entertainment", color: "#8b5cf6", icon: "film" },
        { name: "Utilities", color: "#64748b", icon: "zap" },
        { name: "Housing", color: "#0ea5e9", icon: "home" },
        { name: "Shopping", color: "#ec4899", icon: "shopping-bag" },
        { name: "Transportation", color: "#f43f5e", icon: "car" }
    ];

    const currentCategories = data || [];
    const existingNames = new Set(currentCategories.map(c => c.name));
    const missingDefaults = defaultCategoriesList
        .filter(c => !existingNames.has(c.name))
        .map(c => ({ ...c, user_id: userData.user.id }));

    if (missingDefaults.length > 0) {
        const { data: insertedData, error: insertError } = await supabase
            .from("categories")
            .insert(missingDefaults)
            .select();

        if (insertError) {
            console.error("CATEGORY AUTO-SEED ERROR:", insertError);
            return currentCategories as Category[];
        }

        if (insertedData) {
            const allCategories = [...currentCategories, ...insertedData];
            return allCategories.sort((a, b) => a.name.localeCompare(b.name)) as Category[];
        }
    }

    return currentCategories as Category[];
}

export async function createCategory(category: Partial<Category>) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("categories")
        .insert([{ ...category, user_id: userData.user.id }])
        .select()
        .single();

    if (error) throw error;
    return data as Category;
}

export async function deleteCategory(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
}
