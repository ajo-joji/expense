import { createClient } from "@/lib/supabase/client";

export interface SplitDTO {
    userId: string;
    splitType: 'equal' | 'exact' | 'percentage' | 'shares';
    amountOwed: number;
    percentage?: number;
    shares?: number;
}

export interface PayerDTO {
    userId: string;
    amountPaid: number;
}

export interface CreateSharedExpenseDTO {
    groupId: string;
    description: string;
    totalAmount: number;
    categoryId?: string;
    date: string;
    notes?: string;
    payers: PayerDTO[];
    splits: SplitDTO[];
}

export async function createSharedExpense(dto: CreateSharedExpenseDTO) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    // 1. Insert Group Expense
    const { data: expenseStr, error: expError } = await supabase
        .from("group_expenses")
        .insert([{
            group_id: dto.groupId,
            created_by: userData.user.id,
            description: dto.description,
            category_id: dto.categoryId || null,
            total_amount: dto.totalAmount,
            expense_date: dto.date,
            notes: dto.notes
        }])
        .select()
        .single();

    if (expError) throw expError;
    const expenseId = expenseStr.id;

    // 2. Insert Payers
    const payersInsert = dto.payers.map(p => ({
        expense_id: expenseId,
        user_id: p.userId,
        amount_paid: p.amountPaid
    }));
    const { error: payersError } = await supabase.from("expense_payers").insert(payersInsert);
    if (payersError) throw payersError;

    // 3. Insert Splits
    const splitsInsert = dto.splits.map(s => ({
        expense_id: expenseId,
        user_id: s.userId,
        split_type: s.splitType,
        amount_owed: s.amountOwed,
        percentage: s.percentage || null,
        shares: s.shares || null
    }));
    const { error: splitsError } = await supabase.from("expense_splits").insert(splitsInsert);
    if (splitsError) throw splitsError;

    return expenseStr;
}

// View expenses inside group
export async function getGroupExpenses(groupId: string) {
    const supabase = createClient();

    // We need joining with payers and splits to show who paid and who owes
    const { data, error } = await supabase
        .from("group_expenses")
        .select(`
            *,
            categories(name, color, icon),
            expense_payers(user_id, amount_paid, profiles(full_name)),
            expense_splits(user_id, amount_owed, profiles(full_name))
        `)
        .eq("group_id", groupId)
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

// Raw transactions to compute balances
export async function getGroupBalances(groupId: string) {
    const supabase = createClient();

    // Simplest way is fetching all payers and all splits for the group
    // and aggregating net balances.

    const { data: payers, error: pError } = await supabase
        .from("expense_payers")
        .select("user_id, amount_paid, group_expenses!inner(group_id), profiles(full_name)")
        .eq("group_expenses.group_id", groupId);

    if (pError) throw pError;

    const { data: splits, error: sError } = await supabase
        .from("expense_splits")
        .select("user_id, amount_owed, group_expenses!inner(group_id), profiles(full_name)")
        .eq("group_expenses.group_id", groupId);

    if (sError) throw sError;

    // Settlements
    const { data: settlements, error: setError } = await supabase
        .from("settlements")
        .select("paid_by, paid_to, amount")
        .eq("group_id", groupId);

    if (setError) throw setError;

    const userMap: Record<string, { userId: string, fullName: string, netAmount: number }> = {};

    const registerUser = (userId: string, fullName: string) => {
        if (!userMap[userId]) {
            userMap[userId] = { userId, fullName: fullName || "Unknown", netAmount: 0 };
        }
    };

    // Calculate Paid (Positive net amount)
    payers.forEach(p => {
        registerUser(p.user_id, (p.profiles as any)?.full_name);
        userMap[p.user_id].netAmount += Number(p.amount_paid);
    });

    // Calculate Owed (Negative net amount)
    splits.forEach(s => {
        registerUser(s.user_id, (s.profiles as any)?.full_name);
        userMap[s.user_id].netAmount -= Number(s.amount_owed);
    });

    // Calculate Settlements
    settlements.forEach(s => {
        // Payer paid someone, so their net balance goes UP (they are shoring up what they owe)
        if (s.paid_by) {
            if (userMap[s.paid_by]) userMap[s.paid_by].netAmount += Number(s.amount);
        }
        // Payee received money, so their net balance goes DOWN (they got paid back)
        if (s.paid_to) {
            if (userMap[s.paid_to]) userMap[s.paid_to].netAmount -= Number(s.amount);
        }
    });

    return Object.values(userMap);
}
