export const calculateAge = (digits) => {
    const d = parseInt(digits[0] + digits[1]);
    const m = parseInt(digits[2] + digits[3]);
    const y = parseInt(digits[4] + digits[5] + digits[6] + digits[7]);

    if (isNaN(m) || isNaN(d) || isNaN(y)) return 0;

    const today = new Date();
    const birthDate = new Date(y, m - 1, d);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const getBirthDateString = (digits) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const d = parseInt(digits[0] + digits[1]);
    const m = parseInt(digits[2] + digits[3]);
    const y = parseInt(digits[4] + digits[5] + digits[6] + digits[7]);

    if (isNaN(m) || isNaN(d) || isNaN(y)) return "";
    return `Born ${monthNames[m - 1] || 'January'} ${d}, ${y}`;
};
