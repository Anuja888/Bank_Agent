import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

type Message = {
  id?: number;
  username: string;
  content: string;
  timestamp?: string;
};

export async function GET() {
  try {
    const messages = await executeQuery({
      query: 'SELECT * FROM messages ORDER BY id DESC LIMIT 50',
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, content } = body;
    await executeQuery({
      query: 'INSERT INTO messages (username, content) VALUES (?, ?)',
      values: [username, content],
    });

    // Bot logic (customize or integrate AI)
    let botResponse = 'Welcome to Tata Capital! I can help you with personal loans, interest rates, eligibility, and documentation. What would you like to know about?';
    if (content.toLowerCase().includes('loan')) {
      botResponse = 'Tata Capital offers personal loans at attractive rates. Would you like to know more about eligibility or apply now?';
    }

    await executeQuery({
      query: 'INSERT INTO messages (username, content) VALUES (?, ?)',
      values: ['bot', botResponse],
    });

    return NextResponse.json({ message: botResponse });
  } catch (error) {
    console.error('Error handling chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


