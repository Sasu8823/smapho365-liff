// js/app.js
import { initializeLiff } from './liff-handler.js';
import { setupKeywordInputs, setupAnalyzeButton, setupKeyboardShortcuts } from './ui-controller.js';
import { appState } from './app-state.js';

console.log(appState.keywords);  // ['dog', 'happy', ...]

// === 写真プレビュー表示 ===
function displayPhotoPreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const previewContainer = document.querySelector('.photopreview');
    if (!previewContainer) return;

    previewContainer.innerHTML = ''; // 既存のプレビュー削除

    const preview = document.createElement('img');
    preview.src = e.target.result;
    preview.style.maxWidth = '200px';
    preview.style.marginTop = '10px';
    preview.style.borderRadius = '8px';

    // Optional: 画像削除ボタン
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.style.right = '-15px';
    removeButton.style.top = '-5px';
    removeButton.style.position = 'absolute';
    removeButton.style.display = 'block';
    removeButton.onclick = () => {
      appState.selectedPhoto = null;
      previewContainer.innerHTML = '';
      document.getElementById('photoInput').value = '';
    };

    previewContainer.appendChild(preview);
    previewContainer.appendChild(removeButton);
  };
  reader.readAsDataURL(file);
}

// === ページ読み込み時の初期化 ===
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeLiff();

    setupKeywordInputs(appState);
    setupAnalyzeButton(appState);

    // DOM 要素の取得
    const photoInput = document.getElementById('photoInput');
    const addPhotoButton = document.getElementById('addPhotoButton');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const copyBtn = document.getElementById('copyBtn');


    // Addボタンでファイル選択をトリガー
    if (addPhotoButton && photoInput) {
      addPhotoButton.addEventListener('click', () => photoInput.click());

      photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          appState.selectedPhoto = file;
          console.log('写真が選択されました:', file.name);
          displayPhotoPreview(file);
        }
      });
    }

    setupKeyboardShortcuts(analyzeBtn, copyBtn);

  } catch (err) {
    console.error('初期化エラー:', err);
  }
});

// === エラーハンドリング ===
window.addEventListener('error', (event) => {
  console.error('アプリケーションエラー:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未処理のPromise拒否:', event.reason);
});