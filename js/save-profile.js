// E:\LINE+ChatGPT\smapho365\liff\save-profile.js
import { getUserId } from './liff-handler.js';
    
const userId = await getUserId();

document.getElementById('check_personality').addEventListener('click', (event) => {
    event.preventDefault();
    console.log('性格診断ボタンがクリックされました');

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

    // 送信する
    fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userProfile, answers })
    })
    .then(res => res.json())
    .then(data => {
        console.log('保存成功:', data);
        window.location.href = 'second.html';
    })
    .catch(err => console.error('送信エラー:', err));
});
