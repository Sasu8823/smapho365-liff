# スマホ365

LINE × ChatGPT × Vision API で親へのメッセージを自動生成するミニアプリ

## 概要
- LINEで写真やキーワードを送信すると、AIが親向けのメッセージを3案提案
- ユーザーは選択・編集し、コピーして親に送信

## 技術構成
- LINE Messaging API / LIFF
- Google Cloud Vision API
- OpenAI ChatGPT API (gpt-3.5-turbo)
- Express.js (Node.js)

## セットアップ
1. `.env` にAPIキー等を設定
2. `functions/` ディレクトリで `npm install`


## フロントエンド
- `liff/` ディレクトリにLIFFアプリ
- 写真アップロード、キーワード入力、メッセージ選択・編集・コピーUI
- npm run dev
## バックエンド
- `functions/` ディレクトリにAPI実装
- `/webhook` (LINE), `/vision`, `/chatgpt` エンドポイント
- npm run start

## 運用・開発ガイド
- ログは開発時のみ簡易出力
- APIキーや個人情報は `.env` で管理

## TODO
- Vision/ChatGPT API連携実装
- LINE Messaging API連携実装
- UI/UX改善

--- 