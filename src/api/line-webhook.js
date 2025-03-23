import { Client } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Webhook検証用のGETリクエストに対応
    return res.status(200).send('OK');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ここから下は POST リクエストの処理
  try {
    const events = req.body.events || [];
    console.log('📩 受信イベント:', events);

    await Promise.all(
      events.map(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
          await client.replyMessage(event.replyToken, {
            type: 'text',
            text: `受信メッセージ: ${event.message.text}`,
          });
        }
      })
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ LINE Webhook エラー:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
