import { sendLineNotification } from './line-notify';

export default async function handler(req, res) {
  try {
    const events = req.body?.events || [];

    // イベントごとに処理
    await Promise.all(
      events.map(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
          const userMessage = event.message.text;
          await sendLineNotification(`ユーザーからのメッセージ: ${userMessage}`);
        }
      })
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ LINE Webhook エラー:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
