"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/services/groups";
import { getPersonalExpenses } from "@/services/personal_expenses";
import { getActivityHistory } from "@/services/history";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, ReceiptText, Activity } from "lucide-react";
import Link from "next/link";
import { startOfMonth, isAfter } from "date-fns";

export default function DashboardPage() {
    const { data: groups = [] } = useQuery({ queryKey: ["groups"], queryFn: getGroups });
    const { data: expenses = [] } = useQuery({ queryKey: ["personal_expenses"], queryFn: getPersonalExpenses });
    const { data: logs = [] } = useQuery({ queryKey: ["history"], queryFn: getActivityHistory });

    const thisMonth = startOfMonth(new Date());
    const personalThisMonth = expenses
        .filter(e => isAfter(new Date(e.expense_date), thisMonth) || new Date(e.expense_date).getTime() === thisMonth.getTime())
        .reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your expenses and group activities.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Personal This Month</CardTitle>
                        <ReceiptText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(personalThisMonth)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{groups.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Recorded Activities</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{logs.length > 50 ? '50+' : logs.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Group Activity</CardTitle>
                        <CardDescription>Latest changes from your shared groups.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {logs.slice(0, 5).map(log => (
                                <div key={log.id} className="flex gap-4 items-center border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-semibold">{(log.profiles as any)?.full_name || "Someone"}</span>
                                            {" "}{log.action} a {log.entity_type} in <span className="font-semibold">{(log.groups as any)?.name}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">{formatDate(log.created_at)}</p>
                                    </div>
                                </div>
                            ))}
                            {logs.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No recent activity.</p>}
                            <Link href="/history" className="text-sm text-primary hover:underline block text-center mt-2">
                                View all history
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Your Groups</CardTitle>
                        <CardDescription>Jump straight into your expense tracking.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {groups.slice(0, 5).map(g => (
                                <Link key={g.id} href={`/groups/${g.id}`} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors border shadow-sm">
                                    <span className="font-medium">{g.name}</span>
                                    <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded capitalize">{g.group_type || "general"}</span>
                                </Link>
                            ))}
                            {groups.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">You have no groups yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
