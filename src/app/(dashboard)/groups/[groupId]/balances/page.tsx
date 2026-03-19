"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroupById } from "@/services/groups";
import { getGroupBalances } from "@/services/shared_expenses";
import { createSettlement } from "@/services/settlements";
import { simplifyDebts } from "@/lib/calculations/splits";
import { GroupNav } from "@/components/groups/group-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { UserCircle2, ArrowRight, Check } from "lucide-react";
import { use } from "react";

export default function GroupBalancesPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = use(params);
    const queryClient = useQueryClient();
    const [settlingStr, setSettlingStr] = useState<string | null>(null);

    const { data: group } = useQuery({
        queryKey: ["groups", groupId],
        queryFn: () => getGroupById(groupId),
    });

    const { data: balances = [], isLoading } = useQuery({
        queryKey: ["groupBalances", groupId],
        queryFn: () => getGroupBalances(groupId),
    });

    const settleMutation = useMutation({
        mutationFn: createSettlement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupBalances", groupId] });
            setSettlingStr(null);
        }
    });

    if (isLoading || !group) return <div className="p-8 text-center text-muted-foreground">Loading balances...</div>;

    const simplifiedDebts = simplifyDebts([...balances]);

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto">
            <div className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{group.name} - Balances</h1>
            </div>

            <GroupNav groupId={groupId} />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Individual Totals</CardTitle>
                        <CardDescription>Overall net position in the group.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {balances.length === 0 && <p className="text-muted-foreground text-sm">No expenses yet.</p>}
                            {balances.map(b => (
                                <div key={b.userId} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                                        <p className="font-medium">{b.fullName}</p>
                                    </div>
                                    <div className={`font-bold ${b.netAmount >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                                        {b.netAmount > 0.01 ? `Gets back ${formatCurrency(b.netAmount)}` :
                                            b.netAmount < -0.01 ? `Owes ${formatCurrency(Math.abs(b.netAmount))}` : 'Settled up'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Who owes who</CardTitle>
                        <CardDescription>Suggested payments to settle up all debts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {simplifiedDebts.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                                        <span className="text-emerald-600 font-bold text-xl">✓</span>
                                    </div>
                                    <p>Everyone is settled up!</p>
                                </div>
                            )}
                            {simplifiedDebts.map((debt, index) => (
                                <div key={index} className="flex flex-col gap-2 bg-background p-3 rounded-lg border shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{debt.fromUserName}</span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium text-sm">{debt.toUserName}</span>
                                        </div>
                                        <div className="font-bold text-lg">
                                            {formatCurrency(debt.amount)}
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                                            disabled={settlingStr === `${debt.fromUserId}-${debt.toUserId}`}
                                            onClick={() => {
                                                if (confirm(`Record settlement: ${debt.fromUserName} paid ${debt.toUserName} ${formatCurrency(debt.amount)}?`)) {
                                                    setSettlingStr(`${debt.fromUserId}-${debt.toUserId}`);
                                                    settleMutation.mutate({
                                                        groupId: groupId,
                                                        paidBy: debt.fromUserId,
                                                        paidTo: debt.toUserId,
                                                        amount: debt.amount,
                                                        date: new Date().toISOString().split("T")[0]
                                                    });
                                                }
                                            }}
                                        >
                                            <Check className="mr-1 h-3 w-3" /> Record Payment
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
