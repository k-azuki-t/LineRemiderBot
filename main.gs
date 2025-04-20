function doPost(e) {
  const reseivedData = JSON.parse(e.postData.contents).events[0];
  const replyToken= reseivedData.replyToken;
  const userId = reseivedData.source.userId;
  const eventType = reseivedData.type;
  let replyMessage = null;

  // イベントのタイプに応じて返信内容（replyMessage）を決定
  // 友達登録した場合
  if (eventType === 'follow') {
    replyMessage = `${SELF_INTRODUCTION_MESSAGE}\n${HOW_TO_USE_MESSAGE}`;
  // メッセージを送った場合
  } else if (eventType === 'message') {
    // メッセージの内容に応じて返信内容を決定。
    const messageType = reseivedData.message.type;

    // テキストメッセージを送った場合
    if (messageType === 'text') {
      const reseivedMessage = reseivedData.message.text;
      const checkFormatResult = checkFormat(reseivedMessage);

      if (reseivedMessage === '使い方') {
        replyMessage = HOW_TO_USE_MESSAGE;
      } else {
        // フォーマットチェック
        if (Array.isArray(checkFormatResult)) {
          const [remindDayTime, remindContent] = checkFormatResult;
          const remindDataArray = [[userId, remindContent, remindDayTime]];
          replyMessage = setReminder(remindDataArray);
        } else {
          replyMessage = checkFormatResult;
        }
      } 
    // スタンプなどテキストメッセージ以外を送った場合
    } else {
      replyMessage = GET_TEXTDATA_ERROR_MESSAGE;
    }
    
  // その他の場合
  } else {
    // ここで処理を終了
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  }

  // GASがクライアント側としてLINE APIにリクエスト。
  UrlFetchApp.fetch(POST_REPLY_URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': replyMessage,
      }],
    }),
  });

  // GASがサーバ側としてLINE APIにレスポンス。
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}


// 送られてきたメッセージのフォーマットを確認する関数
// 引数：メッセージ（str・期待するフォーマット：〇〇日後に△△△）
// 戻り値：メッセージのフォーマットが正しければリマインドに関する情報（Array）、不正であればメッセージ（str）
function checkFormat(message) {
  const splitIndex = message.indexOf('に');
  let remindDayTime = new Date();
  let remindContent = null;
  let dayTimePart = null;
  let contentPart = null;

  // メッセージ内に `に` が入っているか確認
  if (splitIndex !== -1) {
    dayTimePart = message.substring(0, splitIndex);
    contentPart = message.substring(splitIndex + 1);
  } else {
    return FORMAT_ERROR_MESSAGE;
  }

  // 日付部分のフォーマット確認
  if (dayTimePart.includes('日後')) {
    dayTimePart = parseInt(dayTimePart.replace('日後', '').trim(), 10);
    if (!dayTimePart) {
      return FORMAT_ERROR_MESSAGE;
    } else {
      // リマインドする日を変数にセット
      // 年月日のみを指定できるようにするため、時分秒は全て0とする
      remindDayTime.setDate(remindDayTime.getDate() + dayTimePart);
      remindDayTime.setHours(0, 0, 0, 0);
    }
  } else {
    return FORMAT_ERROR_MESSAGE;
  }

  // リマインド内容があるかを確認
  if (!contentPart) {
    return NONE_REMINDCONTENT_ERROR_MESSAGE;
  } else {
    remindContent = contentPart;
  }

  return [remindDayTime, remindContent];
}


// スプレッドシートにリマインド設定を保存する関数
// 引数：リマインドデータ（Array・[[リマインドする内容, ユーザーID, リマインド年月日]]）
// 戻り値：メッセージ（str）
function setReminder(remindDataArray) {

  const targetSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const lastRow = targetSheet.getLastRow();
  targetSheet.getRange(lastRow + 1, 1, 1, 3).setValues(remindDataArray);

  return SUCCESS_MESSAGE;
}


// リマインドを実行する関数
// 引数：無し
// 戻り値：無し
function sendRemindMessage() {
  const targetSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const lastRow = targetSheet.getLastRow();

  if (lastRow === 0) {
    // リマインドデータが無い場合はここで処理を終了
    return;
  } else {
    const allRemindData = targetSheet.getRange(1, 1, lastRow, 3).getValues();

    // 1行ずつ日付チェック
    // データ削除時にインデックスが変化しないよう下からチェック
    for (let i = allRemindData.length - 1; i >= 0; i--) {
      const remindData = allRemindData[i];
      const reservedDate = new Date(remindData[2]);
      const nowDate = new Date();

      // 年月日のみを確認するため、時分秒は全て0とする
      reservedDate.setHours(0, 0, 0, 0);
      nowDate.setHours(0, 0, 0, 0);

      // 日付チェック
      if (reservedDate.getDate() === nowDate.getDate()) {
        const userId = remindData[0];
        const remindContent = remindData[1];

        // スプレッドシートから該当行を削除
        targetSheet.deleteRow(i + 1);
        // リマインド送信
        UrlFetchApp.fetch(POST_PUSH_URL, {
          'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_TOKEN,
          },
          'method': 'post',
          'payload': JSON.stringify({
            'to': userId,
            'messages': [{
              'type': 'text',
              'text': `${REMIND_MESSAGE}${remindContent}`,
            }],
          }),
        });
      }
    }
  }
}