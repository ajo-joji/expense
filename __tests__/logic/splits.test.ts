import { describe, it, expect } from "vitest";
import { calculateEqualSplit, calculatePercentageSplit, calculateSharesSplit, simplifyDebts, NetBalance } from "../../src/lib/calculations/splits";

describe("Split Calculations", () => {
    it("should calculate equal splits correctly rounding to 2 decimals", () => {
        expect(calculateEqualSplit(100, 3)).toBe(33.33);
        expect(calculateEqualSplit(100, 4)).toBe(25);
        expect(calculateEqualSplit(0, 5)).toBe(0);
    });

    it("should calculate percentage splits correctly", () => {
        expect(calculatePercentageSplit(200, 15)).toBe(30);
        expect(calculatePercentageSplit(100, 33.33)).toBe(33.33); // 33.3333 -> 33.33
    });

    it("should calculate shares splits correctly", () => {
        // total 5 shares. User has 2 shares out of 5 = 40% of 200 = 80
        expect(calculateSharesSplit(200, 2, 5)).toBe(80);
    });
});

describe("Debt Simplification Algorithm", () => {
    it("should correctly simplify a basic triangular debt", () => {
        // A owes B 10
        // B owes C 10
        // Expected simplified: A owes C 10
        const balances: NetBalance[] = [
            { userId: "A", fullName: "Alice", netAmount: -10 },
            { userId: "B", fullName: "Bob", netAmount: 0 },
            { userId: "C", fullName: "Charlie", netAmount: 10 }
        ];

        const debts = simplifyDebts(balances);
        expect(debts).toHaveLength(1);
        expect(debts[0].fromUserId).toBe("A");
        expect(debts[0].toUserId).toBe("C");
        expect(debts[0].amount).toBe(10);
    });

    it("should correctly handle partial settlements", () => {
        // A owes 50
        // B owes 20
        // C is owed 70
        // A should pay C 50. B should pay C 20.
        const balances: NetBalance[] = [
            { userId: "A", fullName: "Alice", netAmount: -50 },
            { userId: "B", fullName: "Bob", netAmount: -20 },
            { userId: "C", fullName: "Charlie", netAmount: 70 }
        ];

        const debts = simplifyDebts(balances);
        expect(debts).toHaveLength(2);

        const aToC = debts.find(d => d.fromUserId === "A" && d.toUserId === "C");
        expect(aToC?.amount).toBe(50);

        const bToC = debts.find(d => d.fromUserId === "B" && d.toUserId === "C");
        expect(bToC?.amount).toBe(20);
    });
});
