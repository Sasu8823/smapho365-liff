// app.js
import { appState } from './app-state.js';
import { setupKeyboardShortcuts } from './ui-controller.js';
import { generateMessages } from './message-generator.js';


document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photoInput");
  const addPhotoButton = document.getElementById("addPhotoButton");


  // Photo selection
  addPhotoButton.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      appState.selectedPhoto = file;

      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        document.querySelector(".photopreview").innerHTML = `<img src="${reader.result}" width="300px"/>`;
      };
      reader.readAsDataURL(file);
    }
  });
});

// After 3 keywords are entered...
document.addEventListener("threeKeywordsEntered", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const copyBtn = document.getElementById("copyBtn");
  const cancelBtn = document.getElementById('cancelBtn');
  const inputEl = document.getElementById("keywordInput");
  const buttonEl = document.getElementById("analyzeBtn");


  let controller; //  Declare here so both handlers can use it

  analyzeBtn.disabled = false;

  setupKeyboardShortcuts(analyzeBtn, copyBtn);

  analyzeBtn.addEventListener("click", async () => {
    try {
      analyzeBtn.querySelector(".spinner").style.display = "inline-block";
      cancelBtn.style.display = 'inline-block';

      controller = new AbortController(); //  Assign here
      await generateMessages(appState, controller.signal);
    } catch (err) {
      console.error("メッセージ生成失敗:", err);
    } finally {
      analyzeBtn.querySelector(".spinner").style.display = "none";
      cancelBtn.style.display = 'none'; //  Hide cancel button again
      inputEl.disabled = false; // Re-enable input
      buttonEl.disabled = false; // now used to "Send"

    }
  }, { once: true });

  cancelBtn.addEventListener('click', () => {
    if (controller) {
      controller.abort();
      console.log("処理をキャンセルしました");
      inputEl.disabled = false; // Re-enable input
    }
  });
});

