// This is a Vercel Serverless Function to proxy requests to the EC2 n8n instance securely.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const N8N_WEBHOOK_URL = 'http://13.53.216.50:5678/webhook/LexiGuard';

    // The React app now sends JSON ({ documentText, Concerns })
    // Vercel automatically parses JSON bodies into req.body
    const payload = req.body;

    const fetchResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!fetchResponse.ok) {
      console.error(`n8n webhook error: ${fetchResponse.status} ${fetchResponse.statusText}`);
      return res.status(fetchResponse.status).json({ error: 'Failed to process document.' });
    }

    const contentType = fetchResponse.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await fetchResponse.json();
      return res.status(200).json(data);
    } else {
      const text = await fetchResponse.text();
      return res.status(200).send(text);
    }
  } catch (error) {
    console.error('API Proxy Error:', error);
    return res.status(500).json({ error: 'Internal server error while connecting to the analysis engine.' });
  }
}
