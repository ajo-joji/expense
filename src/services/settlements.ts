import { createClient } from "@/lib/supabase/client";
import { Settlement } from "@/types";

export interface CreateSettlementDTO {
    groupId: string;
    paidBy: string;
    paidTo: string;
    amount: number;
    date: string;
    note?: string;
}

export async function createSettlement(dto: CreateSettlementDTO) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("settlements")
        .insert([{
            group_id: dto.groupId,
            paid_by: dto.paidBy,
            paid_to: dto.paidTo,
            amount: dto.amount,
            settlement_date: dto.date,
            note: dto.note || "Settled up"
        }])
        .select()
        .single();

    if (error) throw error;

    // Also record an activity log implicitly if desired, 
    // or just rely on the settlements table for history.
    const { error: logError } = await supabase.from("activity_logs").insert([{
        actor_user_id: userData.user.id,
        group_id: dto.groupId,
        entity_type: "settlement",
        entity_id: data.id,
        action: "created",
        metadata: { amount: dto.amount, paid_to: dto.paidTo }
    }]);

    return data as Settlement;
}
