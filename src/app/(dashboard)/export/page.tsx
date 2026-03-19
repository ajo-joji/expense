"use client";

import { useQuery } from "@tanstack/react-query";
import { getPersonalExpenses } from "@/services/personal_expenses";
import { getGroups } from "@/services/groups";
import { getGroupExpenses, getGroupBalances } from "@/services/shared_expenses";
import { exportPersonalPDF, exportGroupPDF } from "@/lib/pdf/export";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";

export default function ExportPage() {
    const { data: personalExpenses = [] } = useQuery({
        queryKey: ["personal_expenses"],
        queryFn: getPersonalExpenses,
    });

    const { data: groups = [] } = useQuery({
        queryKey: ["groups"],
        queryFn: getGroups,
    });

    const handlePersonalExport = async () => {
        const total = personalExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        await exportPersonalPDF(personalExpenses, total);
    };

    const handleGroupExport = async (group: any) => {
        // Fetch specific data before exporting
        const expenses = await getGroupExpenses(group.id);
        const balances = await getGroupBalances(group.id);
        const total = expenses.reduce((sum, exp) => sum + Number(exp.total_amount), 0);

        await exportGroupPDF(group.name, expenses, total, balances);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Export Reports</h1>
                <p className="text-muted-foreground">Download your data as shareable PDF documents.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Spending</CardTitle>
                        <CardDescription>Export a full PDF of your individual expenses across all time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handlePersonalExport} className="w-full" variant="secondary">
                            <DownloadCloud className="mr-2 h-4 w-4" /> Export Personal Report.pdf
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Group Reports</h2>
                    {groups.length === 0 && <p className="text-muted-foreground text-sm">No groups available to export.</p>}

                    {groups.map(group => (
                        <Card key={group.id}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">{group.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => handleGroupExport(group)} className="w-full" variant="outline">
                                    <DownloadCloud className="mr-2 h-4 w-4" /> Export {group.name} Report.pdf
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
