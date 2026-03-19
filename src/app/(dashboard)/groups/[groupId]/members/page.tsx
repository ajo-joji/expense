"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroupById, getGroupMembers, addMemberToGroup, removeMemberFromGroup } from "@/services/groups";
import { GroupNav } from "@/components/groups/group-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, UserPlus, UserCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { use } from "react";

export default function GroupMembersPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = use(params);
    const queryClient = useQueryClient();
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Quick user check to avoid deleting oneself
    const supabase = createClient();
    const [currentUserId, setCurrentUserId] = useState("");
    supabase.auth.getUser().then(({ data }) => {
        if (data.user) setCurrentUserId(data.user.id);
    });

    const { data: group } = useQuery({
        queryKey: ["groups", groupId],
        queryFn: () => getGroupById(groupId),
    });

    const { data: members = [], isLoading } = useQuery({
        queryKey: ["groupMembers", groupId],
        queryFn: () => getGroupMembers(groupId),
    });

    const addMutation = useMutation({
        mutationFn: (userEmail: string) => addMemberToGroup(groupId, userEmail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
            setEmail("");
            setErrorMsg("");
        },
        onError: (err: any) => {
            setErrorMsg(err.message || "Failed to add member.");
        }
    });

    const removeMutation = useMutation({
        mutationFn: (userId: string) => removeMemberFromGroup(groupId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
        }
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        addMutation.mutate(email);
    };

    if (isLoading || !group) return <div className="p-8 text-center text-muted-foreground">Loading members...</div>;

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto">
            <div className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{group.name} - Members</h1>
            </div>

            <GroupNav groupId={groupId} />

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Group Members</CardTitle>
                        <CardDescription>People involved in splitting expenses for this group.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {members.map(m => (
                                <div key={m.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <UserCircle2 className="h-10 w-10 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium flex items-center gap-2">
                                                {m.profiles?.full_name || "Unknown User"}
                                                {m.role === 'owner' && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase">Owner</span>}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Joined {formatDate(m.joined_at)}</p>
                                        </div>
                                    </div>
                                    {m.user_id !== currentUserId && m.role !== 'owner' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => {
                                                if (confirm("Remove this member?")) {
                                                    removeMutation.mutate(m.user_id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Invite Member</CardTitle>
                        <CardDescription>Add a registered user by email.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
                            <Button type="submit" disabled={addMutation.isPending}>
                                {addMutation.isPending ? "Adding..." : <><UserPlus className="mr-2 h-4 w-4" /> Add Member</>}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                The user must have already signed up to the platform using this email address.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
