import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

export const generateForexAdvice = async (
  message: string,
  context?: string[]
): Promise<string> => {
  try {
    const systemPrompt = `You are an expert forex trading advisor with deep knowledge of:
    - Technical analysis and chart patterns
    - Fundamental analysis and economic indicators
    - Risk management strategies
    - Market psychology and sentiment analysis
    - Currency pair correlations
    - Central bank policies and their impact on currencies
    
    Provide detailed, actionable advice while always emphasizing proper risk management.
    Include specific entry/exit points when relevant, but always mention that trading involves risk.
    Use clear, professional language suitable for both beginners and experienced traders.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add context from previous messages if available
    if (context && context.length > 0) {
      context.forEach((msg, index) => {
        messages.push({
          role: index % 2 === 0 ? 'user' : 'assistant',
          content: msg,
        });
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate forex advice. Please try again.');
  }
};

export const analyzeTradingSignal = async (
  symbol: string,
  marketData: any
): Promise<{
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
}> => {
  try {
    const prompt = `Analyze the following forex data for ${symbol} and provide a trading recommendation:
    
    Market Data: ${JSON.stringify(marketData, null, 2)}
    
    Please provide:
    1. Trading action (buy/sell/hold)
    2. Confidence level (0-100)
    3. Detailed reasoning
    4. Suggested entry price
    5. Stop loss level (if applicable)
    6. Take profit level (if applicable)
    
    Format your response as JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional forex analyst. Provide trading signals in JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Signal analysis error:', error);
    throw new Error('Failed to analyze trading signal');
  }
};