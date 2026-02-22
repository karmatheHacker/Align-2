import { calculateAge, getBirthDateString } from '../dateHelpers';

describe('calculateAge', () => {
    it('returns 18 for birthday today minus 18 years', () => {
        const today = new Date();
        const eighteenYearsAgo = [
            String(today.getDate()).padStart(2, '0'),
            String(today.getMonth() + 1).padStart(2, '0'),
            String(today.getFullYear() - 18)
        ].join('').split('');
        // calculateAge expects an array of digits [d, d, m, m, y, y, y, y]
        // But the join/split above might create [d, d, m, m, y, y, y, y] if digits are correct.
        // Let's be manual.
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear() - 18);
        const digits = [...day.split(''), ...month.split(''), ...year.split('')];

        expect(calculateAge(digits)).toBe(18);
    });

    it('returns 18 for birthday today minus 18 years minus 1 day', () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear() - 18);
        const digits = [...day.split(''), ...month.split(''), ...year.split('')];

        expect(calculateAge(digits)).toBe(18);
    });

    it('returns 17 for birthday tomorrow minus 18 years', () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear() - 18);
        const digits = [...day.split(''), ...month.split(''), ...year.split('')];

        expect(calculateAge(digits)).toBe(17);
    });
});

describe('getBirthDateString', () => {
    it('returns formatted birthday string', () => {
        const digits = ['0', '1', '0', '1', '2', '0', '0', '0'];
        expect(getBirthDateString(digits)).toBe('Born January 1, 2000');
    });

    it('returns empty string for invalid digits', () => {
        const digits = ['X', 'X', '0', '1', '2', '0', '0', '0'];
        expect(getBirthDateString(digits)).toBe('');
    });
});
