import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MarketsPage from './MarketPage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI forex trading assistant. I can help you with market analysis, trading strategies, risk management, and answer any questions about forex trading. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setIsDropdownOpen(false);
  }, [signOut]);

  const generateMockResponse = useCallback((userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('eur/usd') || input.includes('eurusd')) {
      return 'EUR/USD is currently showing bullish momentum. The pair has broken above key resistance at 1.0850. I recommend watching for a retest of this level as support. Key levels to watch: Support at 1.0850, Resistance at 1.0920. Consider risk management with a 2% position size.';
    }
    
    if (input.includes('strategy') || input.includes('trading plan')) {
      return 'Here\'s a solid forex trading strategy: 1) Always use proper risk management (1-2% per trade), 2) Focus on major pairs during London/NY overlap, 3) Use technical analysis with fundamentals, 4) Keep a trading journal, 5) Never risk more than you can afford to lose. Would you like me to elaborate on any of these points?';
    }
    
    if (input.includes('risk') || input.includes('money management')) {
      return 'Risk management is crucial in forex trading. Key principles: 1) Never risk more than 1-2% of your account per trade, 2) Use stop losses on every trade, 3) Maintain a risk-to-reward ratio of at least 1:2, 4) Diversify across different currency pairs, 5) Don\'t overtrade. Remember: preservation of capital is more important than profits.';
    }
    
    if (input.includes('market') || input.includes('analysis')) {
      return 'Current market conditions show mixed signals. Major central banks are in different phases of monetary policy. The USD remains strong due to Fed policy, while EUR is gaining ground on ECB hawkishness. Key events to watch this week: NFP data, ECB meeting minutes, and GDP releases. Would you like analysis on a specific pair?';
    }
    
    return 'That\'s a great question about forex trading! Based on current market conditions and analysis, I\'d recommend focusing on risk management and following the major economic indicators. The forex market is highly dynamic, so staying informed about central bank policies, economic data releases, and technical patterns is crucial. What specific aspect of forex trading would you explore further?';
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Mock AI response - replace with actual API call
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateMockResponse(currentInput),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  }, [inputMessage, isLoading, generateMockResponse]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setIsDropdownOpen(false);
  }, []);

  const quickPrompts = [
    "Analyze EUR/USD trend",
    "Best trading strategy for beginners", 
    "How to manage risk in forex",
    "Current market outlook",
    "Technical analysis tips"
  ];

  // Get user display info
  const userDisplayName = (user?.user_metadata as any)?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = (user?.user_metadata as any)?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  // Navigation items
  const navItems = [
    { id: 'chat', label: 'AI Assistant', icon: '🤖' },
    { id: 'markets', label: 'Live Markets', icon: '📈' }
  ];

  // Navigation Button Component
  const NavButton: React.FC<{ item: { id: string; label: string; icon: string } }> = ({ item }) => (
    <button
      onClick={() => handleTabChange(item.id)}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
        activeTab === item.id
          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
          : 'text-slate-300 hover:text-white hover:bg-slate-700'
      }`}
    >
      <span>{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );

  // User Avatar Component
  const UserAvatar: React.FC = () => (
    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
      {userInitial}
    </div>
  );

  // Logo Component
  const Logo: React.FC = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <span className="text-xl font-bold text-white">ForexAI</span>
    </div>
  );

  // Navigation Bar Component
  const NavigationBar: React.FC = () => (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Logo />
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <NavButton key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 text-slate-300 hover:text-white focus:outline-none transition-colors"
              >
                <UserAvatar />
                <span className="text-sm font-medium">{userDisplayName}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                    </div>
                    
                    {navItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center space-x-2"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    
                    <hr className="border-slate-700 my-1" />
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors flex items-center space-x-2"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Chat Message Component
  const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
    <div className={`chat-message ${message.isUser ? 'user' : 'assistant'}`}>
      <div className={`chat-bubble ${message.isUser ? 'user' : 'assistant'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-slate-500'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  // Loading Message Component
  const LoadingMessage: React.FC = () => (
    <div className="chat-message assistant">
      <div className="chat-bubble assistant">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
          <span>AI is thinking...</span>
        </div>
      </div>
    </div>
  );

  // Quick Prompts Component
  const QuickPrompts: React.FC = () => (
    <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/50">
      <p className="text-sm text-slate-400 mb-3">Quick prompts to get started:</p>
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInputMessage(prompt)}
            className="btn-secondary text-sm py-2 px-3 hover:bg-slate-600 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );

  // Chat Input Component
  const ChatInput: React.FC = () => (
    <div className="border-t border-slate-700 bg-slate-800 p-6 flex-shrink-0">
      <div className="flex space-x-4">
        <div className="flex-1">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about forex trading..."
            className="input-field resize-none"
            rows={1}
            style={{ minHeight: '44px' }}
            maxLength={1000}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>Send</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className={inputMessage.length > 900 ? 'text-orange-400' : ''}>{inputMessage.length}/1000</span>
      </div>
    </div>
  );

  // Chat Content Component
  const ChatContent: React.FC = () => (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Trading Assistant</h1>
            <p className="text-slate-400">Get expert forex guidance and analysis</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && <LoadingMessage />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && <QuickPrompts />}

      {/* Input Area */}
      <ChatInput />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <NavigationBar />
      
      {/* Render content based on active tab */}
      {activeTab === 'chat' ? <ChatContent /> : <MarketsPage />}
    </div>
  );
};

export default DashboardPage;