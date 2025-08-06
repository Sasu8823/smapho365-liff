export async function initializeLiff() {
    try {
        await liff.init({ liffId: '2007856156-GXQbyd30' });
        console.log('LIFF initialized successfully');
    } catch (error) {
        console.error('LIFF initialization failed:', error);
    }
}

export async function getUserId() {
    try {
        const profile = await liff.getProfile();
        return profile.userId || 'ccc';
    } catch (err) {
        console.warn('Failed to get userId:', err);
        return 'ccc';
    }
}
