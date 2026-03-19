import { createClient } from "@/lib/supabase/client";
import { Group, GroupMember, UserProfile } from "@/types";

export async function getGroups() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    // Fetch groups where user is a member or creator
    const { data, error } = await supabase
        .from("groups")
        .select(`
            *,
            group_members!inner(user_id)
        `)
        .eq("group_members.user_id", userData.user.id)
        .order("created_at", { ascending: false });

    if (error) throw error;
    // Remove the joined group_members inner join data from the returned array for cleaner TS
    return data.map(g => {
        const { group_members, ...rest } = g;
        return rest as Group;
    });
}

export async function getGroupById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as Group;
}

export async function createGroup(group: Partial<Group>) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    // Start a simple transaction-like sequence (or just do two queries)
    const { data: newGroup, error: groupError } = await supabase
        .from("groups")
        .insert([{ ...group, created_by: userData.user.id }])
        .select()
        .single();

    if (groupError) throw groupError;

    // Automatically add the creator as a group member
    const { error: memberError } = await supabase
        .from("group_members")
        .insert([{
            group_id: newGroup.id,
            user_id: userData.user.id,
            role: 'owner'
        }]);

    if (memberError) throw memberError;

    return newGroup as Group;
}

export async function deleteGroup(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("groups").delete().eq("id", id);
    if (error) throw error;
}

// MEMBER MANAGEMENT
export async function getGroupMembers(groupId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("group_members")
        .select(`
            *,
            profiles(full_name, avatar_url)
        `)
        .eq("group_id", groupId);

    if (error) throw error;
    return data as GroupMember[];
}

export async function addMemberToGroup(groupId: string, userEmail: string) {
    const supabase = createClient();

    // Lookup user by finding their profile via email lookup.
    // NOTE: In Supabase, mapping an email to a user ID securely often requires an Edge Function 
    // or searching a secure public view. For this clone, we'll try evaluating against auth.users if possible
    // Wait, auth.users is NOT accessible from the frontend directly. Instead, we need a secure RPC
    // or we just look up their profile if we expose email in profiles.
    // Quick workaround: Let's assume the user enters the exact Profile ID or we have an RPC.

    // Instead of raw email lookup, let's call an RPC (we will need to create this in SQL)
    const { data: matchedUser, error: rpcError } = await supabase
        .rpc('get_user_id_by_email', { target_email: userEmail });

    if (rpcError || !matchedUser) throw new Error("User not found by that email.");

    const { data, error } = await supabase
        .from("group_members")
        .insert([{
            group_id: groupId,
            user_id: matchedUser,
            role: 'member'
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function removeMemberFromGroup(groupId: string, userId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("group_members")
        .delete()
        .match({ group_id: groupId, user_id: userId });

    if (error) throw error;
}
