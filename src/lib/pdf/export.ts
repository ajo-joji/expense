import { formatCurrency, formatDate } from "@/lib/utils";

export async function exportPersonalPDF(expenses: any[], totalAmt: number) {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("SplitShare: Personal Expense Report", 14, 22);

    doc.setFontSize(11);
    doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 30);
    doc.text(`Total Spent: ${formatCurrency(totalAmt)}`, 14, 36);

    // Table
    const tableData = expenses.map(exp => [
        formatDate(exp.expense_date),
        exp.description || "-",
        exp.categories?.name || "Uncategorized",
        formatCurrency(exp.amount)
    ]);

    autoTable(doc, {
        startY: 45,
        head: [['Date', 'Description', 'Category', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save("personal-expenses-report.pdf");
}

export async function exportGroupPDF(groupName: string, expenses: any[], totalAmt: number, balances: any[]) {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(`SplitShare: ${groupName} Group Report`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 30);
    doc.text(`Total Group Spending: ${formatCurrency(totalAmt)}`, 14, 36);

    // Balances Summary
    doc.setFontSize(14);
    doc.text("Member Balances", 14, 50);
    const balanceData = balances.map(b => [
        b.fullName,
        b.netAmount >= 0 ? `+${formatCurrency(b.netAmount)}` : `-${formatCurrency(Math.abs(b.netAmount))}`
    ]);

    autoTable(doc, {
        startY: 55,
        head: [['Member', 'Net Balance']],
        body: balanceData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }
    });

    // Expense History
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Expense History", 14, finalY);

    const expenseData = expenses.map(exp => [
        formatDate(exp.expense_date),
        exp.description,
        exp.expense_payers?.[0]?.profiles?.full_name || "Unknown",
        formatCurrency(exp.total_amount)
    ]);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Date', 'Description', 'Paid By', 'Amount']],
        body: expenseData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`${groupName.replace(/\s+/g, '-').toLowerCase()}-report.pdf`);
}
