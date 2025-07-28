import { getUserId } from './liff-handler.js';
import { sendImageAndKeywords } from './api-client.js';
import { displayMessages } from './ui-controller.js';

export async function generateMessages(appState, signal) {
    const userId = await getUserId();
    const formData = new FormData();

    if (appState.selectedPhoto) formData.append('photo', appState.selectedPhoto);
    if (appState.keywords.length > 0) formData.append('keywords', appState.keywords.join(','));
    formData.append('userId', userId);

    const result = await sendImageAndKeywords(formData, signal);
    appState.messages = result.messages || [];
    displayMessages(appState);
}
