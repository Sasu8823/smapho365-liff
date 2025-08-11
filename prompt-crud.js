async function fetchPrompts() {
    const res = await fetch('/api/prompts', { credentials: 'include' });
    const prompts = await res.json();

    const container = document.querySelector('.prompt-list-container');
    container.innerHTML = '<h3>プロンプト一覧</h3>'; // reset

    prompts.forEach(p => {
        const div = document.createElement('div');
        div.className = 'prompt-item';
        div.innerHTML = `
            <div class="prompt-text">${p.text}</div>
            <div class="buttons">
                <button class="edit-btn" onclick="editPrompt(${p.id}, '${p.text}')">編集</button>
                <button class="delete-btn" onclick="deletePrompt(${p.id})">削除</button>
            </div>
        `;
        container.appendChild(div);
    });
}


document.querySelector('.add-btn').addEventListener('click', async () => {
    const text = prompt('新しいプロンプトを入力:');
    if (!text) return;
    await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text })
    });
    fetchPrompts();
});


async function editPrompt(id, oldText) {
    const text = prompt('プロンプトを編集:', oldText);
    if (text === null) return;
    await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text })
    });
    fetchPrompts();
}


async function deletePrompt(id) {
    if (!confirm('このプロンプトを削除しますか？')) return;
    await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    fetchPrompts();
}
