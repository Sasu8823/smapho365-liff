// E:\LINE+ChatGPT\smapho365\liff\script.js

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    console.log(username, password);
    
    if (!username || !password) {
        alert("ユーザー名とパスワードを入力してください");
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            // ログイン成功
            document.getElementById("loginModal").style.display = "none";
            document.getElementById("mainUI").classList.remove("hidden");
        } else {
            alert(data.message || "ログインに失敗しました。");
        }
    } catch (error) {
        console.error("ログインエラー:", error);
        alert("サーバーに接続できませんでした。");
    }
}