"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPersonalExpenses, deletePersonalExpense, createPersonalExpense } from "@/services/personal_expenses";
import { getCategories } from "@/services/categories";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

export default function PersonalExpensesPage() {
    const queryClient = useQueryClient();
    const [isAddMode, setIsAddMode] = useState(false);

    // Form state
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const { data: expenses = [], isLoading: expensesLoading } = useQuery({
        queryKey: ["personal_expenses"],
        queryFn: getPersonalExpenses,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const createMutation = useMutation({
        mutationFn: createPersonalExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personal_expenses"] });
            setIsAddMode(false);
            setAmount("");
            setCategoryId("");
            setDescription("");
        },
        onError: (error) => alert("Failed to add expense: " + error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: deletePersonalExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personal_expenses"] });
        },
        onError: (error) => alert("Failed to delete expense: " + error.message)
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId || !date) return;
        createMutation.mutate({
            amount: Number(amount),
            category_id: categoryId,
            description,
            expense_date: date,
        });
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Personal Expenses</h1>
                    <p className="text-muted-foreground">Track your individual spending</p>
                </div>
                {!isAddMode && (
                    <Button onClick={() => setIsAddMode(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Expense
                    </Button>
                )}
            </div>

            {isAddMode && (
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">New Personal Expense</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="grid gap-2">
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="grid gap-2 lg:col-span-2">
                            <Label>Description</Label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Lunch at Cafe"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-2 lg:col-span-5 justify-end mt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAddMode(false)}>Cancel</Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Saving..." : "Save Expense"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="rounded-md border bg-card">
                {expensesLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading expenses...</div>
                ) : expenses.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No personal expenses recorded yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">{formatDate(exp.expense_date)}</td>
                                    <td className="p-4 align-middle font-medium">{exp.description || "-"}</td>
                                    <td className="p-4 align-middle">
                                        {exp.categories ? (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold" style={{ borderColor: exp.categories.color || '#ccc', color: exp.categories.color || 'inherit' }}>
                                                {exp.categories.name}
                                            </span>
                                        ) : "Uncategorized"}
                                    </td>
                                    <td className="p-4 align-middle text-right font-medium">
                                        {formatCurrency(exp.amount)}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive h-8 w-8"
                                            onClick={() => {
                                                if (confirm("Delete this expense?")) {
                                                    deleteMutation.mutate(exp.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
