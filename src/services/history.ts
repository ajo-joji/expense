import { createClient } from "@/lib/supabase/client";
import { ActivityLog } from "@/types";

export async function getActivityHistory() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    // Fetch activity logs for groups the user is a part of, or personal actions
    // To simplify for this clone, we grab all activity logs joining on groups they belong to

    // First, find what groups the user is in
    const { data: userGroups } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userData.user.id);

    const groupIds = (userGroups || []).map(g => g.group_id);

    const query = supabase
        .from("activity_logs")
        .select(`
            *,
            profiles!actor_user_id(full_name),
            groups(name)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

    if (groupIds.length > 0) {
        query.in("group_id", groupIds);
    } else {
        // Return empty if no groups
        return [];
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
}
