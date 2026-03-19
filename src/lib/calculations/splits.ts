// Calculations for different split types

export function calculateEqualSplit(total: number, memberCount: number): number {
    if (memberCount <= 0) return 0;
    // Round to 2 decimals
    return Math.round((total / memberCount) * 100) / 100;
}

export function calculatePercentageSplit(total: number, percentage: number): number {
    return Math.round((total * (percentage / 100)) * 100) / 100;
}

export function calculateSharesSplit(total: number, userShares: number, totalShares: number): number {
    if (totalShares <= 0) return 0;
    return Math.round((total * (userShares / totalShares)) * 100) / 100;
}

// Balance aggregation type
export type NetBalance = {
    userId: string;
    fullName: string;
    netAmount: number; // Positive means they get money back, negative means they owe money
};

export type DebtEdge = {
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
};

// Greedy debt simplification algorithm
// Computes "Who owes Who" from net balances
export function simplifyDebts(balances: NetBalance[]): DebtEdge[] {
    const debtors = balances.filter(b => b.netAmount < -0.01).sort((a, b) => a.netAmount - b.netAmount); // Most negative first
    const creditors = balances.filter(b => b.netAmount > 0.01).sort((a, b) => b.netAmount - a.netAmount); // Most positive first

    const debts: DebtEdge[] = [];

    let d = 0; // debtor index
    let c = 0; // creditor index

    while (d < debtors.length && c < creditors.length) {
        const debtor = debtors[d];
        const creditor = creditors[c];

        const debtAmount = Math.abs(debtor.netAmount);
        const creditAmount = creditor.netAmount;

        const settled = Math.min(debtAmount, creditAmount);

        // Record the debt edge
        debts.push({
            fromUserId: debtor.userId,
            fromUserName: debtor.fullName,
            toUserId: creditor.userId,
            toUserName: creditor.fullName,
            amount: Math.round(settled * 100) / 100
        });

        debtor.netAmount += settled;
        creditor.netAmount -= settled;

        // Tolerance for floating point precision
        if (Math.abs(debtor.netAmount) < 0.01) d++;
        if (Math.abs(creditor.netAmount) < 0.01) c++;
    }

    return debts;
}
