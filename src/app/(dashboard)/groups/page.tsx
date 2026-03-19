"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/services/groups";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function GroupsPage() {
    const { data: groups = [], isLoading } = useQuery({
        queryKey: ["groups"],
        queryFn: getGroups,
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Groups</h1>
                    <p className="text-muted-foreground">Manage your shared expenses with friends and family.</p>
                </div>
                <Link href="/groups/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Group
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center text-muted-foreground p-12">Loading groups...</div>
            ) : groups.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center h-64">
                    <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <h2 className="text-xl font-semibold mb-2">No groups yet</h2>
                    <p className="text-muted-foreground mb-4">Create a group to start splitting expenses.</p>
                    <Link href="/groups/new">
                        <Button variant="outline">Create your first group</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group) => (
                        <Link href={`/groups/${group.id}`} key={group.id}>
                            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                                <CardHeader>
                                    <CardTitle>{group.name}</CardTitle>
                                    <CardDescription>{group.group_type || "General"}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {group.description || "No description provided."}
                                    </p>
                                    <div className="mt-4 text-xs font-semibold text-muted-foreground">
                                        Created on {formatDate(group.created_at)}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
