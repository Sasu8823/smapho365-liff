export async function initializeLiff() {
    try {
        await liff.init({ liffId: '2007683839-YM9j8eej' });
        console.log('LIFF initialized successfully');
    } catch (error) {
        console.error('LIFF initialization failed:', error);
    }
}

export async function getUserId() {
    try {
        const profile = await liff.getProfile();
        return profile.userId || 'abc';
    } catch (err) {
        console.warn('Failed to get userId:', err);
        return 'abc';
    }
}
