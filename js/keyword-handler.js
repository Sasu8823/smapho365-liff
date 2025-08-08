// keyword-handler.js
import { appState } from './app-state.js';

const inputEl = document.getElementById("keywordInput");
const buttonEl = document.getElementById("analyzeBtn");
const alert_output = document.getElementById("alert_output");

const uniqueKeywords = new Set();

buttonEl.addEventListener("click", () => {
    const keyword = inputEl.value.trim();
    if (!keyword) return;

    if (uniqueKeywords.size < 3 && !uniqueKeywords.has(keyword)) {
        uniqueKeywords.add(keyword);
        appState.keywords.push(keyword);
        showNotification("3つのキーワードを順番に入力します。");
    }
    inputEl.value = "";

    if (uniqueKeywords.size === 3) {
        showNotification("3つのキーワードが正しく認識されました。");

        inputEl.disabled = true;
        buttonEl.disabled = false; // now used to "Send"

        // Trigger app.js to attach generate handler
        const event = new CustomEvent("threeKeywordsEntered", {
            detail: { keywords: Array.from(uniqueKeywords) },
        });
        document.dispatchEvent(event);
    }
});

function showNotification(message) {
    let note = document.getElementById("keywordNotification");

    if (!note) {
        note = document.createElement("div");
        note.id = "keywordNotification";
        note.textContent = message;
        alert_output.parentElement.appendChild(note);
    } else {
        note.textContent = message;
    }

    // Reset classes
    note.classList.remove("hide");
    void note.offsetWidth; // force reflow
    note.classList.add("show");

    // After 3 seconds, hide the notification
    setTimeout(() => {
        note.classList.remove("show");
        note.classList.add("hide");
    }, 3000);
}
