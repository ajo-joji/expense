"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "@/services/groups";
import { getGroupExpenses } from "@/services/shared_expenses";
import { GroupNav } from "@/components/groups/group-nav";
import { Button } from "@/components/ui/button";
import { Plus, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { use } from "react";

export default function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = use(params);
    const { data: group, isLoading: isGroupLoading } = useQuery({
        queryKey: ["groups", groupId],
        queryFn: () => getGroupById(groupId),
    });

    const { data: expenses = [], isLoading: isExpensesLoading } = useQuery({
        queryKey: ["groupExpenses", groupId],
        queryFn: () => getGroupExpenses(groupId),
    });

    if (isGroupLoading) return <div className="p-8 text-center">Loading group details...</div>;
    if (!group) return <div className="p-8 text-center text-destructive">Group not found.</div>;

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
                    <p className="text-muted-foreground">{group.description || "Shared expenses"}</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/groups/${groupId}/expenses/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Shared Expense
                        </Button>
                    </Link>
                </div>
            </div>

            <GroupNav groupId={groupId} />

            <div className="grid gap-6">
                {isExpensesLoading ? (
                    <div className="p-12 text-center text-muted-foreground">Loading expenses...</div>
                ) : expenses.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <ReceiptText className="h-12 w-12 opacity-20 mb-4" />
                            <p className="mb-4">No shared expenses found.</p>
                            <Link href={`/groups/${groupId}/expenses/new`}>
                                <Button variant="outline">Add the first expense</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {expenses.map(exp => (
                            <div key={exp.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-card border rounded-lg shadow-sm gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted border">
                                        <ReceiptText className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base">{exp.description}</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(exp.expense_date)} • {exp.categories?.name || "General"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{formatCurrency(exp.total_amount)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Paid by {(exp as any).expense_payers?.[0]?.profiles?.full_name || "Unknown"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
