// js/ui-controller.js
import { generateMessages } from './message-generator.js';
import { appState } from './app-state.js';

let controller = null;
// Cache DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const keywordInputs = [
  document.getElementById('keywordInput')
];

// === Message UI Handling ===
export function displayMessages(appState) {
  if (appState.messages.length === 0) {
    messagesContainer.innerHTML = '<p>メッセージを生成できませんでした。</p>';
    return;
  }
 console.log('Displaying messages:', appState.messages);
 
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
                placeholder="メッセージを編集できます">${message}
            </textarea>
        </label>
    </div>
  `).join('');

  messagesContainer.innerHTML = `
    <h3>AIが提案するメッセージ（3つの中から1つを選択）</h3>
    <form id="messageForm">
      ${messagesHTML}
    </form>
  `;

  setupMessageSelection(appState);
  setupMessageEditing(appState);
  copyBtn.style.display = 'block';
}

export function setupMessageSelection(appState) {
  const radios = document.querySelectorAll('input[name="messageSelect"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const index = parseInt(e.target.value, 10);
      appState.selectedMessageIndex = index;
      appState.editedMessage = appState.messages[index];
      console.log('選択されたメッセージ:', appState.editedMessage);
    });
  });

  appState.selectedMessageIndex = 0;
  appState.editedMessage = appState.messages[0];
}

export function setupMessageEditing(appState) {
  const textareas = document.querySelectorAll('.message-text');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      appState.messages[index] = e.target.value;
      if (index === appState.selectedMessageIndex) {
        appState.editedMessage = e.target.value;
      }
    });
  });
}

// === Keyword Handling ===
export function setupKeywordInputs(appState) {
  keywordInputs.forEach(input => {
    input.addEventListener('input', () => {
    });
  });
}

// === Copy Feedback ===
export function showCopySuccess() {
  const div = document.createElement('div');
  div.className = 'copy-success';
  div.textContent = 'メッセージをコピーしました！';
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 10px;
    font-size: 12px;
    background: rgba(62, 173, 86, 0.96);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    z-index: 1000;
    animation: fadeInOut 5s ease-in-out;
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

export function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    showCopySuccess();
  } catch (err) {
    console.error('フォールバックコピーエラー:', err);
    alert('コピーに失敗しました。手動でコピーしてください。');
  }

  document.body.removeChild(textarea);
}



// setupAnalyzeButton
export function setupAnalyzeButton(appState) {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const spinner = analyzeBtn?.querySelector('.spinner');

  if (!analyzeBtn || !cancelBtn || !spinner ) {
    console.warn('Missing required DOM elements.');
    return;
  }

  analyzeBtn.addEventListener('click', async () => {
    console.log('clicked analyzeBtn');
    
    if (!appState.selectedPhoto && appState.keywords.length === 0) {
      alert('写真またはキーワードを入力してください。');
      return;
    }

    controller = new AbortController();

    // UI updates
    spinner.style.display = 'inline-block';
    analyzeBtn.disabled = true;
    cancelBtn.style.display = 'inline-block';

    try {
      await generateMessages(appState, controller.signal);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('生成キャンセルされました。');
      } else {
        console.error('メッセージ生成エラー:', error);
        alert('メッセージの生成に失敗しました。しばらくしてから再度お試しください。');
      }
    } finally {
      spinner.style.display = 'none';
      analyzeBtn.disabled = false;
      cancelBtn.style.display = 'none';
    }
  });

  cancelBtn.addEventListener('click', () => {
    if (controller) {
      controller.abort();
    }
  });
}

// setupKeyboardShortcuts
export function setupKeyboardShortcuts(analyzeBtn, copyBtn) {
  // Ctrl+Enter → Trigger Analyze
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      console.log('Ctrl+Enter pressed');
      
      if (!analyzeBtn.disabled) {
        analyzeBtn.click();
      }
    }

    // Ctrl+C → Copy selected message
    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      handleCopy();
    }
  });

  // Copy button click
  if (copyBtn) {
    copyBtn.addEventListener('click', handleCopy);
  }

  // Copy function (shared by Ctrl+C and button)
  async function handleCopy() {
    if (appState.selectedMessageIndex === -1) {
      alert('メッセージを選択してください。');
      return;
    }

    const messageToCopy = appState.editedMessage || appState.messages[appState.selectedMessageIndex];

    try {
      await navigator.clipboard.writeText(messageToCopy);
      showCopySuccess();

      if (liff && liff.default.isInClient()) {
        liff.default.openWindow({
          url: 'https://line.me',
          external: true
        });
      }
    } catch (error) {
      console.error('クリップボードコピーエラー:', error);
      fallbackCopy(messageToCopy);
    }
  }
}