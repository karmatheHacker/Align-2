import submitProfile from '../submitProfile';

global.fetch = jest.fn();

describe('submitProfile', () => {
    beforeEach(() => {
        fetch.mockClear();
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
});
