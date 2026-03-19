"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroupById, getGroupMembers } from "@/services/groups";
import { createSharedExpense, CreateSharedExpenseDTO } from "@/services/shared_expenses";
import { getCategories } from "@/services/categories";
import { calculateEqualSplit } from "@/lib/calculations/splits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { use } from "react";

export default function NewSharedExpensePage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [payerId, setPayerId] = useState("");
    const [splitType, setSplitType] = useState<'equal' | 'exact'>('equal');
    const [exactAmounts, setExactAmounts] = useState<Record<string, string>>({});

    const { data: group } = useQuery({
        queryKey: ["groups", groupId],
        queryFn: () => getGroupById(groupId),
    });

    const { data: members = [] } = useQuery({
        queryKey: ["groupMembers", groupId],
        queryFn: () => getGroupMembers(groupId),
    });

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    // Auto-select first member as payer if not set
    useEffect(() => {
        if (!payerId && members.length > 0) {
            setPayerId(members[0].user_id);
        }
    }, [members, payerId]);

    const createMutation = useMutation({
        mutationFn: createSharedExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
            queryClient.invalidateQueries({ queryKey: ["groupBalances", groupId] });
            router.push(`/groups/${groupId}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !payerId) return;

        const totalNum = Number(amount);

        const dto: CreateSharedExpenseDTO = {
            groupId: groupId,
            description,
            totalAmount: totalNum,
            categoryId: categoryId || undefined,
            date,
            payers: [{ userId: payerId, amountPaid: totalNum }],
            splits: []
        };

        if (splitType === 'equal') {
            const splitAmt = calculateEqualSplit(totalNum, members.length);
            // Handle last penny rounding issue simply by letting the last person take variance
            let sum = 0;
            members.forEach((m, idx) => {
                const isLast = idx === members.length - 1;
                const owed = isLast ? Number((totalNum - sum).toFixed(2)) : splitAmt;
                sum += owed;
                dto.splits.push({
                    userId: m.user_id,
                    splitType: 'equal',
                    amountOwed: owed
                });
            });
        } else if (splitType === 'exact') {
            let sum = 0;
            members.forEach(m => {
                const owed = Number(exactAmounts[m.user_id] || 0);
                sum += owed;
                dto.splits.push({
                    userId: m.user_id,
                    splitType: 'exact',
                    amountOwed: owed
                });
            });
            // Validation step: Check if sum equals total amount
            if (Math.abs(sum - totalNum) > 0.01) {
                alert(`Exact amounts sum to ${sum}, but total is ${totalNum}. Please fix before submitting.`);
                return;
            }
        }

        createMutation.mutate(dto);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Add an expense</CardTitle>
                    <CardDescription>{group ? `With you and members of ${group.name}` : "Loading..."}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Input placeholder="e.g. Dinner at Mario's" value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>

                        <div className="grid gap-2">
                            <Label>Amount</Label>
                            <Input type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Date</Label>
                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                    <option value="">General</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-2 bg-muted/50 p-4 rounded-lg mt-2">
                            <Label className="text-base text-center mb-2">Who paid?</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm font-medium" value={payerId} onChange={e => setPayerId(e.target.value)} required>
                                {members.map(m => (
                                    <option key={m.user_id} value={m.user_id}>{m.profiles?.full_name || 'Member'}</option>
                                ))}
                            </select>
                            <div className="text-center mt-2 font-medium text-sm">
                                split
                                <select className="ml-2 border-b-2 border-primary bg-transparent outline-none font-bold" value={splitType} onChange={e => setSplitType(e.target.value as any)}>
                                    <option value="equal">equally</option>
                                    <option value="exact">exactly</option>
                                </select>
                            </div>

                            {/* EXACT SPLIT UX */}
                            {splitType === 'exact' && (
                                <div className="mt-4 space-y-3 border-t pt-4">
                                    {members.map(m => (
                                        <div key={m.user_id} className="flex items-center justify-between">
                                            <Label className="font-normal">{m.profiles?.full_name}</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="w-24 h-8 text-right"
                                                placeholder="0.00"
                                                value={exactAmounts[m.user_id] || ""}
                                                onChange={e => setExactAmounts({ ...exactAmounts, [m.user_id]: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending || members.length === 0}>
                            {createMutation.isPending ? "Saving..." : "Save Expense"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
