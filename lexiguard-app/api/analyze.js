// This is a Vercel Serverless Function to proxy requests to the EC2 n8n instance securely.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const N8N_WEBHOOK_URL = 'http://13.53.216.50:5678/webhook/LexiGuard';

    // We must pass the raw body to the n8n webhook since it contains multipart/form-data
    // In Vercel, by default the body is parsed. We need to disable body parsing for this route.
    
    // Actually, Vercel standard Node.js serverless functions parse the body.
    // The easiest way to proxy multipart/form-data without writing a custom busboy parser 
    // is to just fetch using the exact same request stream. However, in Vercel API routes, 
    // `req` is a Node.js IncomingMessage. 
    // Let's use the fetch API with the raw headers and body.
    const fetchResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': req.headers['content-type']
      },
      // If deployed on Vercel, req is a readable stream and can be passed to fetch body
      // Note: We need to export config to disable bodyParser so req remains a stream
      body: req,
      duplex: 'half'
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

// Disable body parsing so we can stream the multipart/form-data directly to n8n
export const config = {
  api: {
    bodyParser: false,
  },
};
