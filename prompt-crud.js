document.addEventListener('DOMContentLoaded', () => {
    const promptModal = document.getElementById('promptModal');
    const promptText = document.getElementById('promptText');
    const promptSubmitBtn = document.getElementById('promptSubmitBtn');
    const promptCancelBtn = document.getElementById('promptCancelBtn');

    let editId = null; // track if editing

    // Show modal for adding
    document.querySelector('.add-btn').addEventListener('click', () => {
        editId = null;
        promptText.value = '';
        promptSubmitBtn.textContent = '追加';
        promptModal.style.display = 'flex';
    });

    // Save prompt (add or edit)
    promptSubmitBtn.addEventListener('click', async () => {
        const text = promptText.value.trim();
        if (!text) return alert('プロンプトを入力してください。');

        if (editId) {
            // edit mode
            await fetch(`/api/prompts/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ text })
            });
        } else {
            // add mode
            await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ text })
            });
        }

        promptModal.style.display = 'none';
        fetchPrompts();
    });

    // Cancel modal
    promptCancelBtn.addEventListener('click', () => {
        promptModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === promptModal) {
            promptModal.style.display = 'none';
        }
    });

    // expose editPrompt to global scope
    window.editPrompt = function(id, oldText) {
        editId = id;
        promptText.value = oldText;
        promptSubmitBtn.textContent = '更新';
        promptModal.style.display = 'flex';
    }

    // expose deletePrompt
    window.deletePrompt = async function(id) {
        if (!confirm('このプロンプトを削除しますか？')) return;
        await fetch(`/api/prompts/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        fetchPrompts();
    }
});