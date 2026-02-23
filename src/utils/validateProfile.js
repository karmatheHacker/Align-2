const validateProfile = (profile) => {
    const errors = {};
    const lettersOnly = /^[A-Za-z]+$/;

    const firstName = profile.firstName?.trim();
    const lastName = profile.lastName?.trim();

    if (!firstName || firstName.length < 2) {
        errors.firstName = "First name must be at least 2 characters.";
    } else if (!lettersOnly.test(firstName)) {
        errors.firstName = "First name should only contain letters.";
    }

    if (lastName && lastName.length > 0) {
        if (lastName.length < 2) {
            errors.lastName = "Last name must be at least 2 characters.";
        } else if (!lettersOnly.test(lastName)) {
            errors.lastName = "Last name should only contain letters.";
        }
    }

    if (!profile.birthday) {
        errors.birthday = "Birthday is required.";
    } else {
        const { day, month, year } = profile.birthday;
        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);

        const birthDate = new Date(y, m - 1, d);

        // Check if date is valid (e.g. not Feb 30)
        if (birthDate.getFullYear() !== y || birthDate.getMonth() !== m - 1 || birthDate.getDate() !== d) {
            errors.birthday = "Invalid date.";
        } else {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18 || age > 100) {
                errors.birthday = "Age must be between 18 and 100.";
            }
        }
    }

    if (!profile.gender) errors.gender = "Gender is required.";
    if (!profile.sexuality) errors.sexuality = "Sexual orientation is required.";
    if (!profile.datingIntention) errors.datingIntention = "Dating intention is required.";
    if (!profile.height || !profile.height.value) errors.height = "Height is required.";
    if (!profile.photos || profile.photos.length < 3) errors.photos = "At least three photos are required.";

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export default validateProfile;
