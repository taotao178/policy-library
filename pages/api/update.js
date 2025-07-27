/**
 * Vercel Serverless Function: 自动更新政策库
 *
 * 此函数每次被调用时都会向 Supabase 的 REST API 插入一条示例政策。
 * 在实际项目中，你可以在此函数中编写爬虫逻辑，抓取目标网站的最新政策信息并插入到数据库中。
 *
 * 为确保安全，使用服务端密钥 (service role) 调用 REST API。
 */
export default async function handler(req, res) {
  // 仅允许 POST 请求
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return res
        .status(500)
        .json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
    }
    // 构造示例政策数据。实际项目中请替换为抓取的数据。
    const newPolicy = {
      title: '\u793a\u4f8b\u653f\u7b56\u6761\u76ee',
      date: new Date().toISOString().split('T')[0],
      category: '\u793a\u4f8b',
      region: '\u5168\u56fd',
      content: '\u8fd9\u662f\u4e00\u4e2a\u793a\u4f8b\u653f\u7b56\u5185\u5bb9\uff0c\u7528\u4e8e\u6f14\u793a\u81ea\u52a8\u66f4\u65b0\u529f\u80fd\u3002',
      link: 'https://example.com'
    };
    // 调用 Supabase RESTful API 插入数据
    const response = await fetch(`${supabaseUrl}/rest/v1/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify(newPolicy)
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to insert policy', details: data });
    }
    return res.status(200).json({ message: 'Policy inserted', policy: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
}
