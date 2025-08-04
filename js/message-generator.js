// message-generator.js

import { getUserId } from './liff-handler.js';
import { sendImageAndKeywords } from './api-client.js';
import { displayMessages } from './ui-controller.js';

export async function generateMessages(appState, signal) {
  const formData = new FormData();

  // Get user ID
  const userId = await getUserId();
  formData.append('userId', userId);

  // Attach photo if available
  if (appState.selectedPhoto) {
    formData.append('photo', appState.selectedPhoto);
  }

  // Attach keywords
  if (appState.keywords && appState.keywords.length > 0) {
    formData.append('keywords', appState.keywords.join(','));
  }

  console.log('Sending to /api/analyze-image:', {
    hasPhoto: !!appState.selectedPhoto,
    keywords: appState.keywords,
    userId
  });

  try {
    const result = await sendImageAndKeywords(formData, signal);
    appState.messages = result.messages || [];
    displayMessages(appState);
  } catch (error) {
    console.error('API 呼び出しエラー:', error);
    throw error;
  }
}
