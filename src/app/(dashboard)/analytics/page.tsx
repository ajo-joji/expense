"use client";

import { useQuery } from "@tanstack/react-query";
import { getPersonalExpenses } from "@/services/personal_expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, parseISO, isAfter } from "date-fns";

export default function AnalyticsPage() {
    const { data: expenses = [], isLoading } = useQuery({
        queryKey: ["personal_expenses"],
        queryFn: getPersonalExpenses,
    });

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;

    const now = new Date();
    const today = startOfDay(now);
    const thisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const thisMonth = startOfMonth(now);
    const thisYear = startOfYear(now);

    let totalToday = 0;
    let totalWeek = 0;
    let totalMonth = 0;
    let totalYear = 0;

    const categoryMap: Record<string, { name: string; value: number; color: string }> = {};
    const monthlyMap: Record<string, { month: string; amount: number }> = {};

    expenses.forEach((exp) => {
        const amt = Number(exp.amount);
        const date = parseISO(exp.expense_date);

        if (isAfter(date, today) || date.getTime() === today.getTime()) totalToday += amt;
        if (isAfter(date, thisWeek) || date.getTime() === thisWeek.getTime()) totalWeek += amt;
        if (isAfter(date, thisMonth) || date.getTime() === thisMonth.getTime()) totalMonth += amt;
        if (isAfter(date, thisYear) || date.getTime() === thisYear.getTime()) totalYear += amt;

        // Group by category
        const catName = exp.categories?.name || "Uncategorized";
        const catColor = exp.categories?.color || "#8884d8";
        if (!categoryMap[catName]) {
            categoryMap[catName] = { name: catName, value: 0, color: catColor };
        }
        categoryMap[catName].value += amt;

        // Group by month
        const monthStr = exp.expense_date.substring(0, 7); // YYYY-MM
        if (!monthlyMap[monthStr]) monthlyMap[monthStr] = { month: monthStr, amount: 0 };
        monthlyMap[monthStr].amount += amt;
    });

    const categoryData = Object.values(categoryMap).sort((a, b) => b.value - a.value);
    const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your personal spending trends.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Spent Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalToday)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalWeek)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalMonth)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Year</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalYear)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {categoryData.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground">No data</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Monthly Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {monthlyData.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground">No data</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                    <Bar dataKey="amount" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
