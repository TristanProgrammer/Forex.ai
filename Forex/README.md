# ForexAI - AI-Powered Forex Trading Assistant

A comprehensive web application that serves as an intelligent forex trading assistant, powered by OpenAI's GPT-4 and integrated with real-time market data.

## Features

- **AI-Powered Chat Interface**: ChatGPT-like dashboard for forex trading advice
- **Real-Time Market Data**: Integration with 12Data API for live forex prices
- **User Authentication**: Secure signup/signin with Supabase
- **Subscription Management**: Free, Premium, and Professional tiers
- **PayPal Integration**: Secure payment processing for upgrades
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT-4 API
- **Market Data**: 12Data API
- **Payments**: PayPal
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- 12Data API key (for market data)
- PayPal developer account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forex-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your API keys and configuration:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_OPENAI_API_KEY`: Your OpenAI API key
- `VITE_TWELVE_DATA_API_KEY`: Your 12Data API key

### Database Setup

1. Create the following tables in your Supabase database:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
```

2. Set up authentication triggers:
```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utility libraries
│   ├── supabase.ts    # Supabase client and helpers
│   └── openai.ts      # OpenAI integration
├── pages/             # Page components
│   ├── HomePage.tsx   # Landing page
│   ├── SignUpPage.tsx # Authentication page
│   ├── DashboardPage.tsx # Main chat interface
│   └── UpgradePage.tsx   # Subscription management
├── types/             # TypeScript type definitions
│   └── index.ts
└── App.tsx           # Main application component
```

## Key Features

### 1. AI Chat Interface
- ChatGPT-like interface for forex trading advice
- Context-aware conversations
- Real-time message streaming
- Chat session management

### 2. Market Data Integration
- Live forex prices from 12Data API
- Real-time market alerts
- Economic calendar integration
- Technical analysis data

### 3. Subscription Tiers
- **Free**: 10 AI queries/day, basic features
- **Premium**: 500 queries/day, advanced analysis, trading signals
- **Professional**: Unlimited queries, API access, priority support

### 4. Security Features
- Row Level Security (RLS) in Supabase
- Secure authentication flow
- API key protection
- Data encryption

## Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
- Connect your repository to Netlify
- Set environment variables in Netlify dashboard
- Deploy with build command: `npm run build`
- Publish directory: `dist`

### Environment Variables for Production

Make sure to set these in your deployment environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_TWELVE_DATA_API_KEY`

## API Integration

### OpenAI Integration
The app uses OpenAI's GPT-4 model for generating forex trading advice. The AI is specifically trained to provide:
- Technical analysis insights
- Risk management strategies
- Market sentiment analysis
- Trading recommendations

### 12Data Integration
Real-time forex market data including:
- Currency pair prices
- Price changes and percentages
- Volume data
- Historical data for analysis

### PayPal Integration
Secure payment processing for subscription upgrades:
- Monthly and yearly billing cycles
- Automatic subscription management
- Secure payment handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@forexai.com
- Documentation: [docs.forexai.com](https://docs.forexai.com)
- Community: [community.forexai.com](https://community.forexai.com)