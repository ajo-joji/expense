import { createClient } from "@/lib/supabase/client";
import { PersonalExpense } from "@/types";

export async function getPersonalExpenses() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("personal_expenses")
        .select(`*, categories(name, color, icon)`)
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as PersonalExpense[];
}

export async function createPersonalExpense(expense: Partial<PersonalExpense>) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("personal_expenses")
        .insert([{ ...expense, user_id: userData.user.id }])
        .select()
        .single();

    if (error) throw error;
    return data as PersonalExpense;
}

export async function deletePersonalExpense(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("personal_expenses").delete().eq("id", id);
    if (error) throw error;
}
