"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, deleteCategory } from "@/services/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [isAddMode, setIsAddMode] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState<"expense" | "income">("expense");

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsAddMode(false);
            setName("");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        // Omit 'type' until backend supports it
        createMutation.mutate({ name, color: "#8884d8" });
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage expense and income categories</p>
                </div>
                {!isAddMode && (
                    <Button onClick={() => setIsAddMode(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                )}
            </div>

            {isAddMode && (
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">New Category</h2>
                    <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row sm:items-end w-full">
                        <div className="grid gap-2 flex-1">
                            <Label>Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Groceries"
                                required
                            />
                        </div>
                        <div className="grid gap-2 flex-1">
                            <Label>Type</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={type}
                                onChange={(e) => setType(e.target.value as "expense" | "income")}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={createMutation.isPending}>Save</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsAddMode(false)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="rounded-md border bg-card">
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No categories defined.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{c.name}</td>
                                    <td className="p-4 align-middle capitalize">
                                        <span className={(c as any).type === 'income' ? 'text-emerald-500 font-medium' : ''}>
                                            {(c as any).type || 'expense'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive h-8 w-8"
                                            onClick={() => {
                                                if (confirm("Delete category? This will detach related transactions.")) {
                                                    deleteMutation.mutate(c.id);
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
