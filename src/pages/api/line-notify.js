export async function sendLineNotification(message) {
    const groupId = process.env.GROUP_ID; // ✅ .env.local / Vercelに設定したグループID
    console.log("✅ groupId:", groupId); // デバッグ用ログ（ログで確認できる）
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    };
  
    const body = JSON.stringify({
      to: groupId,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    });
  
    try {
      const response = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers,
        body,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ LINE送信エラー:', errorText);
      } else {
        console.log('✅ LINEにメッセージを送信しました');
      }
    } catch (error) {
      console.error('❌ LINE通知送信中の例外:', error);
    }
  }
  