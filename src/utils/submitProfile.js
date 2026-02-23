const PLACEHOLDER_URL = 'https://api.example.com/profile';

async function submitProfile(profile) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    // No real backend yet — skip the network call and return a mock success.
    // When a real API is ready, set EXPO_PUBLIC_API_URL in .env to your endpoint.
    if (!apiUrl || apiUrl === PLACEHOLDER_URL) {
        return { success: true, mock: true };
    }

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
