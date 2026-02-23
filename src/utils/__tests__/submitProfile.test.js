import submitProfile from '../submitProfile';

global.fetch = jest.fn();

describe('submitProfile', () => {
    beforeEach(() => {
        fetch.mockClear();
        // Use a real (non-placeholder) URL so tests exercise the fetch path
        process.env.EXPO_PUBLIC_API_URL = 'https://api.test.com/profile';
    });

    afterEach(() => {
        delete process.env.EXPO_PUBLIC_API_URL;
    });

    const mockProfile = { firstName: 'John' };

    it('resolves with response JSON on successful POST', async () => {
        const mockResponse = { success: true };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await submitProfile(mockProfile);
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockProfile),
        }));
    });

    it('throws error on non-ok response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        await expect(submitProfile(mockProfile)).rejects.toThrow('Submission failed');
    });

    it('propagates network errors', async () => {
        const networkError = new Error('Network failure');
        fetch.mockRejectedValueOnce(networkError);

        await expect(submitProfile(mockProfile)).rejects.toThrow('Network failure');
    });

    it('returns mock success when no real API URL is configured', async () => {
        delete process.env.EXPO_PUBLIC_API_URL;
        const result = await submitProfile(mockProfile);
        expect(result).toEqual({ success: true, mock: true });
        expect(fetch).not.toHaveBeenCalled();
    });
});
