import { NextResponse } from 'next/server';

// Simple in-memory conversation store (for development only)
const conversationStore = new Map();

const systemPrompt = `You are a senior Tata Capital personal loan agent with 15+ years of experience. Your primary role is to professionally guide customers through the complete loan process while systematically collecting all necessary information.

CRITICAL BEHAVIOR REQUIREMENTS:
1. ALWAYS start by asking for the customer's name in your first response
2. Systematically collect information in this order:
   - Customer name
   - Loan purpose and amount
   - Monthly income and employment
   - Current financial obligations
   - Credit score awareness
3. Maintain conversation context and refer back to previously provided information
4. Ask follow-up questions based on their responses
5. Provide personalized guidance based on collected information
6. Always sound like a professional senior agent, not a generic chatbot

INFORMATION COLLECTION FLOW:
Step 1: Introduction & Name
- "Good day! I'm your Tata Capital personal loan specialist. May I have your good name to begin our discussion?"

Step 2: Loan Requirements
- After getting name: "Thank you, [Name]. Could you share what amount you're looking for and the purpose of the loan?"

Step 3: Financial Assessment
- After loan details: "Understood. To assess your eligibility, could you tell me about your current monthly income and employment situation?"

Step 4: Additional Details
- Continue gathering: employment type, existing loans, credit score awareness

Step 5: Personalized Guidance
- Provide specific advice based on all collected information

EXAMPLE CONVERSATION:
User: "hi"
You: "Good day! I'm your Tata Capital personal loan specialist. May I have your good name to begin our discussion?"

User: "My name is Raj"
You: "Thank you, Raj. I'd be happy to assist you with a personal loan. Could you share what amount you're looking for and the purpose of the loan?"

User: "I need 5 lakhs for home renovation"
You: "Understood, Raj. Home renovation is a common and valid purpose. For a 5 lakh loan, let me check your eligibility. Could you tell me about your current monthly income and employment situation?"

User: "I earn 50,000 per month as a salaried employee"
You: "Thank you for sharing that, Raj. With your 50,000 monthly income, you meet our basic eligibility criteria. Do you have any existing loans or credit card dues I should be aware of?"

Remember: You are a senior agent guiding customers through a professional loan assessment process. Always maintain context, refer to previously provided information, and ask logical follow-up questions.`;

export async function GET() {
  // Return empty messages since we're not using database
  return NextResponse.json({ messages: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, sessionId = 'default' } = body;
    
    // Validate input
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid input: content is required' }, { status: 400 });
    }

    // Get conversation history for this session
    let conversationHistory = conversationStore.get(sessionId) || [];
    
    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: content
      }
    ];

    // Get AI response from DeepSeek
    let botResponse = '';
    try {
      const aiResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error(`DeepSeek API error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      botResponse = aiData.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your request. Please try again.';
      
      // Update conversation history
      conversationHistory.push(
        { role: 'user', content: content },
        { role: 'assistant', content: botResponse }
      );
      
      // Keep only last 10 messages to prevent memory overflow
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }
      
      conversationStore.set(sessionId, conversationHistory);
      
    } catch (aiError) {
      console.error('AI API error:', aiError);
      // Enhanced fallback responses that act like a senior agent
      const userMessage = content.toLowerCase().trim();
      
      if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
        botResponse = 'Good day! I\'m your Tata Capital personal loan specialist. May I have your good name to begin our discussion?';
      } else if (userMessage.includes('loan') || userMessage.includes('need loan')) {
        botResponse = 'I\'d be happy to assist you with a personal loan. To provide you with the best guidance, may I know your name and the specific amount you\'re looking for?';
      } else if ((userMessage.includes('name') && userMessage.includes('my')) || userMessage.length < 30 && /^[a-zA-Z\s]+$/.test(userMessage)) {
        // If user provides their name
        const name = content.replace(/my name is|i am|name is|i'm|name:/gi, '').trim();
        botResponse = `Thank you, ${name}. I'm here to help you with your personal loan needs. Could you share what amount you're looking for and the purpose of the loan?`;
      } else if (userMessage.includes('lakh') || userMessage.includes('amount') || /\d+/.test(userMessage)) {
        botResponse = 'Understood. To better assess your eligibility for this amount, could you tell me about your current monthly income and employment situation?';
      } else if (userMessage.includes('income') || userMessage.includes('salary') || userMessage.includes('earn')) {
        botResponse = 'Thank you for sharing your income details. Do you have any existing loans or credit card dues I should be aware of for a complete assessment?';
      } else {
        botResponse = 'As your Tata Capital personal loan specialist, I\'d like to understand your requirements better. May I have your name to begin our personalized discussion?';
      }
    }

    return NextResponse.json({ message: botResponse, sessionId });
  } catch (error) {
    console.error('Error handling chat:', error);
    return NextResponse.json({ error: 'Failed to process your message' }, { status: 500 });
  }
}
