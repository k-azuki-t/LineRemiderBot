// メッセージ一覧
const FORMAT_ERROR_MESSAGE = '正しいフォーマットで入力してね！「使い方」と送ると詳細が分かるよ！';
const NONE_REMINDCONTENT_ERROR_MESSAGE = 'リマインドしたい内容を入力してね！';
const GET_TEXTDATA_ERROR_MESSAGE = 'ごめんね、テキストメッセージしか反応できないよ！';
const SUCCESS_MESSAGE = 'リマインドして欲しいんだね、了解！代わりに覚えておくね！';
const REMIND_MESSAGE = 'リマインドするよ、確認してね！\n\n【リマインドする内容】\n';
const SELF_INTRODUCTION_MESSAGE = '初めまして、リマインダーちゃんです！'
const HOW_TO_USE_MESSAGE = '以下フォーマットに沿ってメッセージを送ってね！\n〇〇日後の当日午前8時から午前9時の間に△△△をリマインドするよ！\n\n【フォーマット】\n〇〇日後に△△△\n\n【注意事項】\n〇〇は1以上でお願いするね！';

// メッセージ送信時に使用するLINE API一覧
const POST_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';
const POST_PUSH_URL = 'https://api.line.me/v2/bot/message/push';

// トークン・ID
const CHANNEL_TOKEN = 'xxxxx';
const SPREADSHEET_ID = 'xxxxx';
