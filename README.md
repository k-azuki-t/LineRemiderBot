# 📱 LINE Remind Bot - Google Apps Script 版

このリポジトリは、**LINE Messaging API** と **Google Apps Script (GAS)** を使った、**リマインドBot**の実装です。  
LINEで「○○日後に△△△」のような形式のメッセージを送ると、指定日にリマインド通知が届きます。

---

## 🚀 主な機能

- ✅ フォロー時の自動応答（挨拶＋使い方案内）
- ✅ 「〇〇日後に△△△」形式のメッセージ解析
- ✅ Googleスプレッドシートへのリマインド内容保存
- ✅ 指定日にLINEでリマインド通知を送信

---

## 📦 使用技術

- Google Apps Script (GAS)
- LINE Messaging API
- Google スプレッドシート

---

## 🔧 セットアップ手順

### 1. LINE Developersでチャネル作成

- [LINE Developers](https://developers.line.biz/) にログインし、Messaging APIチャネルを作成
- チャネルアクセストークンを取得
- Webhook URL にGASのWebアプリURLを設定

### 2. GASプロジェクトの準備

- Google Apps Scriptで新しいプロジェクトを作成
- 以下の定数をコード内に定義します：

```javascript
const CHANNEL_TOKEN = 'YOUR_LINE_CHANNEL_TOKEN';
const POST_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';
const POST_PUSH_URL = 'https://api.line.me/v2/bot/message/push';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

const SELF_INTRODUCTION_MESSAGE = 'こんにちは！リマインドBotです。';
const HOW_TO_USE_MESSAGE = '「3日後にプレゼン準備」などの形式でメッセージを送ってね！';
const FORMAT_ERROR_MESSAGE = 'フォーマットが正しくありません。「〇〇日後に△△△」の形式で入力してください。';
const NONE_REMINDCONTENT_ERROR_MESSAGE = 'リマインド内容が空です。「〇〇日後に△△△」の形式で入力してください。';
const SUCCESS_MESSAGE = 'リマインドを登録しました！';
const GET_TEXTDATA_ERROR_MESSAGE = 'テキストメッセージを送ってください。';
const REMIND_MESSAGE = 'リマインドです！：';
```
### 3. スプレッドシートの準備
Googleスプレッドシートを作成し、SPREADSHEET_ID にそのIDを指定

フォーマット（列順）:
ユーザーID | リマインド内容 | リマインド日時

### 4. トリガーの設定（リマインド送信）
GASの「トリガー」メニューから sendRemindMessage 関数に対して
「時間主導型トリガー（例：日次）」を設定してください

## 🧠 動作の概要
1. LINEからのPOSTリクエストを doPost(e) で受け取る
2. イベントに応じて処理を分岐
   - follow イベント：挨拶＋使い方のメッセージ
   - message イベント（テキスト）：内容を解析・保存
   - それ以外や不正な形式：エラー返信
3．毎日 sendRemindMessage() を実行してスプレッドシートをチェックし、リマインド対象があれば送信

## 💬 使用例
1. ユーザーが送信：
   ```
   
   3日後に資料を提出する
   
   ```
2. Botが返信：
   ```

   リマインドを登録しました！
   
   ```
3. 3日後にLINEで送信されるメッセージ：
   ```

   リマインドです！：資料を提出する
   
   ```

## 💡 補足
- 「使い方」と入力すればヘルプメッセージを返信
- 非テキストメッセージ（スタンプなど）はエラーメッセージを返します


   
