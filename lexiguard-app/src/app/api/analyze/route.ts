import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Webhook URL of the n8n EC2 instance
    const N8N_WEBHOOK_URL = 'http://13.53.216.50:5678/webhook/LexiGuard';

    // Forward the exact same FormData to n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      // Some webhooks might need specific headers, but FormData automatically 
      // sets the correct multipart/form-data boundary.
    });

    if (!response.ok) {
      console.error(`n8n webhook error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to process document in the backend workflow.' },
        { status: response.status }
      );
    }

    // n8n can return JSON or plain text
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      return new NextResponse(text, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while connecting to the analysis engine.' },
      { status: 500 }
    );
  }
}
