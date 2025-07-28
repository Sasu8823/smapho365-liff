// liff/app.js
// TODO: Initialize LIFF SDK if needed

// LIFF SDK の初期化

// アプリの状態管理
let appState = {
    selectedPhoto: null,
    keywords: [],
    messages: [],
    selectedMessageIndex: -1,
    editedMessage: ''
};

controller = null;

// DOM 要素の取得
const photoInput = document.getElementById('photoInput');
const keywordInput1 = document.getElementById('keywordInput1');
const keywordInput2 = document.getElementById('keywordInput2');
const keywordInput3 = document.getElementById('keywordInput3');
const analyzeBtn = document.getElementById('analyzeBtn');
const messagesContainer = document.getElementById('messagesContainer');
const copyBtn = document.getElementById('copyBtn');
const check_personality = document.getElementById('check_personality');

// LIFF の初期化
async function initializeLiff() {
    try {

        await liff.init({ liffId: '2007683839-YM9j8eej' }); // <-- use global `liff`
        console.log('LIFF initialized successfully');
    } catch (error) {
        console.error('LIFF initialization failed:', error);
    }
}


// 写真アップロード処理
photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        appState.selectedPhoto = file;
        console.log('写真が選択されました:', file.name);

        // プレビュー表示（オプション）
        displayPhotoPreview(file);
    }
});

// 写真プレビュー表示
function displayPhotoPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewContainer = document.querySelector('.photopreview');
        if (!previewContainer) return;

        // 既存のプレビュー画像を削除
        previewContainer.innerHTML = '';

        const preview = document.createElement('img');
        preview.src = e.target.result;
        preview.style.maxWidth = '200px';
        preview.style.marginTop = '10px';
        preview.style.borderRadius = '8px';

        previewContainer.appendChild(preview);
    };
    reader.readAsDataURL(file);
}

// 分析ボタンクリック処理
analyzeBtn.addEventListener('click', async () => {
    if (!appState.selectedPhoto && appState.keywords.length === 0) {
        alert('写真またはキーワードを入力してください。');
        return;
    }

    controller = new AbortController(); // 新しいAbortControllerを生成
    cancelBtn.style.display = 'inline'; // 停止ボタンを表示
    // ボタンを無効化してローディング表示
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'AIがメッセージを作成中...';

    try {
        await generateMessages(controller.signal);
    } catch (error) {
        console.error('メッセージ生成エラー:', error);
        alert('メッセージの生成に失敗しました。しばらくしてから再度お試しください。');
    } finally {
        // ボタンを元に戻す
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '再度メッセージ作成する';
        cancelBtn.style.display = 'none';
    }
});

cancelBtn.addEventListener('click', () => {
    if (controller) {
        controller.abort(); // 通信を中止
    }
});

// メッセージ生成処理
async function generateMessages(signal) {
    const formData = new FormData();

    // Check if LIFF is initialized and get userId
    let userId = '';
    try {
        const profile = await liff.getProfile();
        userId = profile.userId || 'abc';
        if (userId === 'abc') console.warn('🧪 Using fallback userId "abc" for testing');
        formData.append('userId', userId);
    } catch (err) {
        console.warn(' Failed to get userId from LIFF:', err);
        userId = 'abc';
        console.warn('🧪 Using fallback userId "abc" for testing');
        formData.append('userId', userId);
    }

    // Attach photo if available
    if (appState.selectedPhoto) {
        formData.append('photo', appState.selectedPhoto);
    }

    // Attach keywords if available
    if (appState.keywords && appState.keywords.length > 0) {
        formData.append('keywords', appState.keywords.join(','));
    }

    console.log(' Sending to /api/analyze-image:', {
        hasPhoto: !!appState.selectedPhoto,
        keywords: appState.keywords,
        userId
    });

    try {
        const response = await fetch('/api/analyze-image', {
            method: 'POST',
            body: formData,
            signal
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        appState.messages = result.messages || [];

        displayMessages();

    } catch (error) {
        console.error('API 呼び出しエラー:', error);
        throw error;
    }
}


// メッセージ表示処理
function displayMessages() {
    if (appState.messages.length === 0) {
        messagesContainer.innerHTML = '<p>メッセージを生成できませんでした。</p>';
        return;
    }

    const messagesHTML = appState.messages.map((message, index) => `
        <div class="message-option">
            <input type="radio" 
                   id="message${index}" 
                   name="messageSelect" 
                   value="${index}"
                   ${index === 0 ? 'checked' : ''}>
            <label for="message${index}">
                <textarea class="message-text" 
                          data-index="${index}" 
                          placeholder="メッセージを編集できます">${message}</textarea>
            </label>
        </div>
    `).join('');

    messagesContainer.innerHTML = `
        <h3>AIが提案するメッセージ（3つの中から1つを選択）</h3>
        <form id="messageForm">
            ${messagesHTML}
        </form>
    `;

    // ラジオボタンのイベントリスナーを設定
    setupMessageSelection();

    // テキストエリアのイベントリスナーを設定
    setupMessageEditing();

    // コピーボタンを表示
    copyBtn.style.display = 'block';
}

// メッセージ選択処理
function setupMessageSelection() {
    const radioButtons = document.querySelectorAll('input[name="messageSelect"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            appState.selectedMessageIndex = parseInt(event.target.value);
            appState.editedMessage = appState.messages[appState.selectedMessageIndex];
            console.log('選択されたメッセージ:', appState.editedMessage);
        });
    });

    // 初期選択
    appState.selectedMessageIndex = 0;
    appState.editedMessage = appState.messages[0];
}

// メッセージ編集処理
function setupMessageEditing() {
    const textareas = document.querySelectorAll('.message-text');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', (event) => {
            const index = parseInt(event.target.dataset.index);
            appState.messages[index] = event.target.value;

            // 現在選択されているメッセージが編集された場合
            if (index === appState.selectedMessageIndex) {
                appState.editedMessage = event.target.value;
            }
        });
    });
}

// コピーボタンクリック処理
copyBtn.addEventListener('click', async () => {
    if (appState.selectedMessageIndex === -1) {
        alert('メッセージを選択してください。');
        return;
    }

    const messageToCopy = appState.editedMessage || appState.messages[appState.selectedMessageIndex];

    try {
        await navigator.clipboard.writeText(messageToCopy);

        // 成功メッセージ表示
        showCopySuccess();

        // LINEアプリを開く（LIFF環境の場合）
        if (liff && liff.default.isInClient()) {
            liff.default.openWindow({
                url: 'https://line.me',
                external: true
            });
        }

    } catch (error) {
        console.error('クリップボードコピーエラー:', error);

        // フォールバック: テキストエリアで選択
        fallbackCopy(messageToCopy);
    }
});

// コピー成功メッセージ表示
function showCopySuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'copy-success';
    successDiv.textContent = 'メッセージをコピーしました！';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 10px;
        font-size: 12px;
        background:rgba(7, 7, 6, 0.25);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeInOut 5s ease-in-out;
    `;

    document.body.appendChild(successDiv);

    // 3秒後に削除
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// フォールバックコピー処理
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (error) {
        console.error('フォールバックコピーエラー:', error);
        alert('コピーに失敗しました。手動でコピーしてください。');
    }

    document.body.removeChild(textarea);
}

// キーワード入力処理
function updateKeywords() {
    const k1 = keywordInput1.value.trim();
    const k2 = keywordInput2.value.trim();
    const k3 = keywordInput3.value.trim();
    appState.keywords = [k1, k2, k3].filter(Boolean); // Remove empty ones
}

// Add event listeners
[keywordInput1, keywordInput2, keywordInput3].forEach(input => {
    input.addEventListener('input', updateKeywords);
});

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', async () => {
    await initializeLiff();

    // キーボードショートカット設定
    setupKeyboardShortcuts();
});

// キーボードショートカット設定
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl+Enter でメッセージ生成
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            if (!analyzeBtn.disabled) {
                analyzeBtn.click();
            }
        }

        // Ctrl+C でコピー（メッセージが選択されている場合）
        if (event.ctrlKey && event.key === 'c' && appState.selectedMessageIndex !== -1) {
            event.preventDefault();
            copyBtn.click();
        }
    });
}

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('アプリケーションエラー:', event.error);
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', (event) => {
    console.error('未処理のPromise拒否:', event.reason);
});