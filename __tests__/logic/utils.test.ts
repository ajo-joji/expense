import { expect, test, describe } from 'vitest';
import { formatCurrency, formatDate } from '../../src/lib/utils';

describe('Utility Functions', () => {
    test('formatCurrency formats numbers correctly as EUR', () => {
        const amount = 1234.56;
        const formatted = formatCurrency(amount);
        // Varies by localization, but typically contains the € symbol or EUR
        expect(formatted).toMatch(/€|EUR/);
        expect(formatted).toContain('1,234.56');
    });

    test('formatCurrency allows custom currency', () => {
        const amount = 100;
        const formatted = formatCurrency(amount, 'USD');
        expect(formatted).toContain('$');
        expect(formatted).toContain('100.00');
    });

    test('formatDate strings dates correctly', () => {
        const rawDate = '2023-10-15';
        const formattedDate = formatDate(rawDate);
        expect(formattedDate).toContain('Oct');
        expect(formattedDate).toContain('15');
        expect(formattedDate).toContain('2023');
    });
});
