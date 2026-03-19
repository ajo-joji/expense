"use client";

import { useQuery } from "@tanstack/react-query";
import { getActivityHistory } from "@/services/history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, HandCoins, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
    const { data: logs = [], isLoading } = useQuery({
        queryKey: ["history"],
        queryFn: getActivityHistory,
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Recent Activity</h1>
                <p className="text-muted-foreground">What's been happening in your groups.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Feed</CardTitle>
                    <CardDescription>The latest 50 actions from your shared groups.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading history...</div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <History className="h-12 w-12 opacity-20 mb-4" />
                            <p>No activity recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {logs.map(log => (
                                <div key={log.id} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                                    <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        {log.entity_type === 'settlement' ? (
                                            <HandCoins className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-semibold px-1">
                                                {(log.profiles as any)?.full_name || "Someone"}
                                            </span>
                                            {log.action} a {log.entity_type} in
                                            <span className="font-semibold px-1">{(log.groups as any)?.name}</span>.
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDate(log.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
