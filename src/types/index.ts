export type UserProfile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    default_currency: string;
    created_at: string;
};

export type Category = {
    id: string;
    user_id: string;
    name: string;
    color: string | null;
    icon: string | null;
    created_at: string;
};

export type PersonalExpense = {
    id: string;
    user_id: string;
    category_id: string | null;
    amount: number;
    description: string | null;
    expense_date: string;
    created_at: string;
    updated_at: string;
    categories?: { name: string; color: string | null; icon: string | null };
};

export type Group = {
    id: string;
    created_by: string;
    name: string;
    description: string | null;
    group_type: string | null;
    created_at: string;
};

export type GroupMember = {
    id: string;
    group_id: string;
    user_id: string;
    role: string;
    joined_at: string;
    profiles?: { full_name: string | null; avatar_url: string | null };
};

export type GroupExpense = {
    id: string;
    group_id: string;
    created_by: string;
    description: string;
    category_id: string | null;
    total_amount: number;
    expense_date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    categories?: { name: string; color: string | null; icon: string | null };
    expense_payers?: ExpensePayer[];
    expense_splits?: ExpenseSplit[];
};

export type ExpensePayer = {
    id: string;
    expense_id: string;
    user_id: string;
    amount_paid: number;
    profiles?: { full_name: string | null };
};

export type ExpenseSplit = {
    id: string;
    expense_id: string;
    user_id: string;
    split_type: string | null;
    amount_owed: number;
    percentage: number | null;
    shares: number | null;
    profiles?: { full_name: string | null };
};

export type Settlement = {
    id: string;
    group_id: string;
    paid_by: string;
    paid_to: string;
    amount: number;
    settlement_date: string;
    note: string | null;
    created_at: string;
    payer?: { full_name: string | null };
    payee?: { full_name: string | null };
};

export type ActivityLog = {
    id: string;
    actor_user_id: string;
    group_id: string;
    entity_type: string;
    entity_id: string;
    action: string;
    metadata: any;
    created_at: string;
    profiles?: { full_name: string | null };
};
