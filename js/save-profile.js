// E:\LINE+ChatGPT\smapho365\liff\save-profile.js
import { getUserId } from './liff-handler.js';

document.getElementById('check_personality').addEventListener('click', async (event) => {
    event.preventDefault();
    console.log('性格診断ボタンがクリックされました');

    const userId = await getUserId();  // ここで await を使う

    const callingName = document.getElementById('callingName').value;
    const age = document.getElementById('age').value;
    const tone = document.getElementById('tone').value;
    const personality = 'やさしい';

    const answers = {};
    for (let i = 1; i <= 10; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        answers[`q${i}`] = selected ? selected.value : null;
    }

    const userProfile = {
        callingName,
        age,
        tone,
        personality
    };

    try {
        const res = await fetch('/api/save-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, userProfile, answers })
        });

        const data = await res.json();
        console.log('保存成功:', data);

        const container = document.getElementById('statusContainer');
        container.innerHTML = `
            <p class="save-profile-success-alarm" id = "save-profile-success-alarm">✅ 正確にアーカイブされています。</p>
            <a href="index.html" class="nav-link-wrapper">
                ホームページに戻る
                <div class="arrow-wrapper">
                <span class="m_scroll_arrows unu"></span>
                <span class="m_scroll_arrows doi"></span>
                <span class="m_scroll_arrows trei"></span>
                </div>
            </a>

            <!-- Message page link with arrow -->
            <a href="second.html" class="nav-link-wrapper">
                メッセージ生成ページに戻る
                <div class="arrow-wrapper">
                <span class="m_scroll_arrows unu"></span>
                <span class="m_scroll_arrows doi"></span>
                <span class="m_scroll_arrows trei"></span>
                </div>
            </a>
        `;

        setTimeout(() => {
            const message = document.getElementById('save-profile-success-alarm');
            if (message) message.remove();
        }, 3000);
    } catch (err) {
        console.error('送信エラー:', err);
        const container = document.getElementById('statusContainer');
        container.innerHTML = `
            <p class="save-profile-error-alarm" id = "save-profile-error-alarm">❌ 保存に失敗しました。もう一度お試しください。</p>
        `;

        setTimeout(() => {
            const message = document.getElementById('save-profile-error-alarm');
            if (message) message.remove();
        }, 3000);
    }
});
