export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const events = req.body.events;

    console.log('受信イベント:', events);

    // 応答（LINEの仕様）
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('LINE Webhook エラー:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
