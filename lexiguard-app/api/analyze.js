import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const N8N_WEBHOOK_URL = 'http://13.53.216.50:5678/webhook/LexiGuard';
    const payload = req.body;

    const axiosResponse = await axios.post(N8N_WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout
    });

    return res.status(200).json(axiosResponse.data);
    
  } catch (error) {
    console.error('API Proxy Error:', error.message);
    
    let statusCode = 500;
    let errorMessage = 'Internal server error while connecting to the analysis engine.';
    let rawError = error.message;

    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      statusCode = error.response.status;
      errorMessage = 'Analysis engine returned an error.';
      rawError = JSON.stringify(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received (e.g., connection refused, timeout)
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Connection to the analysis engine timed out (Vercel timeout limit).';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused. The AWS EC2 instance is unreachable from Vercel (Check AWS Security Groups).';
      } else {
        errorMessage = 'Failed to connect to the analysis engine. The AWS EC2 instance may be offline or blocking Vercel IP addresses.';
      }
    }

    return res.status(statusCode).json({ 
      error: errorMessage,
      details: rawError,
      code: error.code
    });
  }
}
