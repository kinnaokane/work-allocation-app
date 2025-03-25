export async function sendLineNotification(message) {
    const groupId = 'YOUR_GROUP_ID'; // ✅ 後ほど本物のグループIDに置き換える
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
        console.error('❌ LINE送信エラー', await response.text());
      } else {
        console.log('✅ LINEにメッセージを送信しました');
      }
    } catch (error) {
      console.error('❌ LINE通知送信中の例外:', error);
    }
  }
  