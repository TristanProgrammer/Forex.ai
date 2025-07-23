import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Brain,
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Globe,
  Sparkles,
  DollarSign,
  Target,
  Activity,
  Bot,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Enhanced Digital Button Component
const DigitalButton = ({ children, className = "", variant = "primary", ...props }) => {
  const baseClasses = "relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl focus:ring-blue-500/50 border-0",
    secondary: "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg",
    ghost: "bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
};

// Floating Animation Component
const FloatingElement = ({ children, delay = 0, className = "" }) => {
  return (
    <div 
      className={`animate-bounce ${className}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      {children}
    </div>
  );
};

// Avatar Component for testimonials
const Avatar = ({ name, className = "" }) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  const colors = [
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-teal-500 to-cyan-600'
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  
  return (
    <div className={`${colors[colorIndex]} ${className} rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-white/20`}>
      {initials}
    </div>
  );
};

// Data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Trader",
    company: "Goldman Sachs",
    rating: 5,
    content: "ForexAI's predictions have increased my portfolio returns by 45%. The AI insights are incredibly accurate and save me countless hours of analysis."
  },
  {
    name: "Marcus Chen",
    role: "Portfolio Manager",
    company: "JP Morgan",
    rating: 5,
    content: "The risk management tools are phenomenal. I've reduced my losses by 60% while maintaining aggressive growth strategies. Game changer!"
  },
  {
    name: "Elena Rodriguez",
    role: "Quantitative Analyst",
    company: "Citadel",
    rating: 5,
    content: "The AI chat feature feels like having a forex expert available 24/7. It understands complex market conditions and provides actionable insights."
  }
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Advanced neural networks analyze 50+ market indicators to predict price movements with 94% accuracy.',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    stats: '94% Accuracy',
    highlight: 'Most Popular'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Lightning-fast data processing with sub-millisecond latency for critical trading decisions.',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    stats: '<1ms Latency',
    highlight: ''
  },
  {
    icon: Bot,
    title: 'AI Trading Assistant',
    description: 'Conversational AI that understands context, learns from your style, and provides personalized strategies.',
    gradient: 'from-green-500 via-emerald-500 to-blue-500',
    stats: '24/7 Available',
    highlight: 'New'
  },
  {
    icon: Shield,
    title: 'Smart Risk Management',
    description: 'AI-driven risk assessment with automated stop-loss and position sizing based on your risk profile.',
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    stats: '60% Loss Reduction',
    highlight: ''
  },
  {
    icon: Zap,
    title: 'Instant Market Alerts',
    description: 'Real-time notifications for breaking news, pattern formations, and high-probability setups.',
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
    stats: 'Real-time',
    highlight: ''
  },
  {
    icon: Target,
    title: 'Precision Entries',
    description: 'AI calculates optimal entry and exit points based on technical analysis and market sentiment.',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    stats: '+45% Returns',
    highlight: 'Trending'
  },
];

const stats = [
  { number: '150K+', label: 'Active Traders', icon: Users, color: 'text-blue-500' },
  { number: '99.97%', label: 'Uptime', icon: Zap, color: 'text-green-500' },
  { number: '180+', label: 'Countries', icon: Globe, color: 'text-purple-500' },
  { number: '$2.1B+', label: 'Trading Volume', icon: DollarSign, color: 'text-yellow-500' },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 shadow-lg shadow-gray-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <TrendingUp className="h-10 w-10 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                ForexAI
              </span>
              <span className="px-2 py-1 text-xs bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-bold">
                LIVE
              </span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <DigitalButton 
                variant="secondary" 
                className="text-base px-6 py-3"
                onClick={() => navigate('/signin')}
              >
                Sign In
              </DigitalButton>
              <DigitalButton 
                className="text-base px-8 py-3"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
                <Sparkles className="w-4 h-4 ml-2" />
              </DigitalButton>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <DigitalButton 
                  variant="secondary" 
                  className="w-full justify-center"
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </DigitalButton>
                <DigitalButton 
                  className="w-full justify-center"
                  onClick={() => navigate('/signup')}
                >
                  Start Free Trial
                </DigitalButton>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-600 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Floating Elements */}
          <FloatingElement delay={0} className="absolute top-32 left-1/4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold">+$12,450</span>
              </div>
              <p className="text-xs text-gray-600">Today's Profit</p>
            </div>
          </FloatingElement>
          
          <FloatingElement delay={1} className="absolute top-48 right-1/4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
              <div className="flex items-center gap-2 text-blue-600">
                <Activity className="w-5 h-5" />
                <span className="font-bold">EUR/USD</span>
              </div>
              <p className="text-xs text-gray-600">Strong Buy Signal</p>
            </div>
          </FloatingElement>
          
          <FloatingElement delay={2} className="absolute bottom-32 right-1/3">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
              <div className="flex items-center gap-2 text-purple-600">
                <Brain className="w-5 h-5" />
                <span className="font-bold">94%</span>
              </div>
              <p className="text-xs text-gray-600">AI Accuracy</p>
            </div>
          </FloatingElement>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200/50">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">New: Advanced AI Trading Algorithms Released</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Forex Trading
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your trading with AI that predicts market movements with <strong className="text-green-600">94% accuracy</strong>. 
            Join 150,000+ traders who've increased their profits by an average of <strong className="text-blue-600">45%</strong>.
          </p>
          
          <div className="flex justify-center mb-16">
            <DigitalButton 
              className="text-xl px-12 py-6 shadow-2xl"
              onClick={() => navigate('/signup')}
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </DigitalButton>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Setup in 60 Seconds</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-20 mb-24 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-500/20 border border-gray-200/50 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center group hover:scale-105 transition-transform duration-300">
                    <Icon className={`h-12 w-12 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Powered by Advanced AI</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="text-gray-900">To Trade Smarter</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive AI suite gives you the edge you need to outperform the market consistently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    {feature.highlight && (
                      <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white rounded-full ${
                        feature.highlight === 'New' ? 'bg-green-500' :
                        feature.highlight === 'Most Popular' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}>
                        {feature.highlight}
                      </div>
                    )}
                    
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                    
                    <div className="flex items-center justify-between mt-6">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${feature.gradient} bg-opacity-10 text-gray-700`}>
                        {feature.stats}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Wall Street</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how professional traders are using ForexAI to consistently outperform the market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full hover:bg-white/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <Avatar 
                      name={testimonial.name}
                      className="h-16 w-16 text-lg"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                      <p className="text-blue-300 font-medium">{testimonial.role}</p>
                      <p className="text-gray-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Ready to <span className="text-yellow-300">10X</span> Your Trading?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 150,000+ traders who've transformed their portfolios with AI. 
            Start your free trial today and experience the future of trading.
          </p>
          
          <div className="flex justify-center mb-12">
            <DigitalButton 
              className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6 shadow-2xl"
              onClick={() => navigate('/signup')}
            >
              Start Free 14-Day Trial
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </DigitalButton>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>14-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <span className="ml-3 text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ForexAI
                </span>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Empowering traders worldwide with cutting-edge AI technology. 
                Make smarter decisions, reduce risks, and maximize profits with our intelligent trading platform.
              </p>
              <div className="flex space-x-4">
                {['f', 't', 'in', 'ig'].map((social, i) => (
                  <div key={i} className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer group">
                    <span className="text-sm font-bold group-hover:scale-110 transition-transform">{social}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Product</h3>
              <ul className="space-y-4 text-gray-400">
                {['Features', 'Pricing', 'API Documentation', 'Integrations', 'Mobile App'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
              <ul className="space-y-4 text-gray-400">
                {['Help Center', 'Contact Support', 'Privacy Policy', 'Terms of Service', 'Status Page'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 ForexAI. All rights reserved. Made with ❤️ for traders worldwide.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;