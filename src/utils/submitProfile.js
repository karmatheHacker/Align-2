async function submitProfile(profile) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com/profile';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
    });

    if (!response.ok) {
        throw new Error('Submission failed. Please check your connection.');
    }

    return response.json();
}

export default submitProfile;
