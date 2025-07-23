import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { finnhubService, CurrencyPair } from '../services/finnHubService'; // ✅ Correct import

interface MarketNews {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  time: string;
  currency: string;
}

const MarketsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPair, setSelectedPair] = useState('AAPL'); // ✅ Changed to stock symbol for Finnhub
  const [marketData, setMarketData] = useState<CurrencyPair[]>([]);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [apiConnected, setApiConnected] = useState(false);

  // ✅ Updated to stock symbols (Finnhub works better with stocks than forex)
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];

  useEffect(() => {
    initializeMarketData();
    
    // Set up interval for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      if (apiConnected) {
        fetchLiveData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const initializeMarketData = async () => {
    setLoading(true);
    setError('');

    try {
      // ✅ Test API connection using finnhubService
      const connectionTest = await finnhubService.testConnection();
      setApiConnected(connectionTest);

      if (connectionTest) {
        await fetchLiveData();
      } else {
        // Fall back to mock data if API is not working
        console.warn('API connection failed, using mock data');
        loadMockData();
      }
    } catch (err) {
      console.error('Failed to initialize market data:', err);
      setError('Failed to connect to market data API');
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveData = async () => {
    try {
      console.log('Fetching live data from Finnhub API...');
      
      // ✅ Fetch quotes using finnhubService
      const quotes = await finnhubService.getMultipleQuotes(symbols);
      
      // ✅ Convert to our local format using finnhubService
      const convertedData: CurrencyPair[] = quotes.map(quote => 
        finnhubService.convertToLocalFormat(quote)
      );

      setMarketData(convertedData);
      setError('');
      
      console.log('Successfully fetched live market data:', convertedData);
    } catch (err) {
      console.error('Error fetching live data:', err);
      setError('Failed to fetch live market data');
      
      // Don't fall back to mock data if we already have some real data
      if (marketData.length === 0) {
        loadMockData();
      }
    }
  };

  const loadMockData = () => {
    console.log('Loading mock data...');
    
    // ✅ Updated mock data to use stock symbols
    const mockData: CurrencyPair[] = [
      { pair: 'AAPL', price: 175.43, change: 2.34, changePercent: 1.35, high: 176.12, low: 173.45, spread: 0.02, volume: 125000 },
      { pair: 'GOOGL', price: 142.67, change: -1.23, changePercent: -0.85, high: 144.56, low: 141.89, spread: 0.03, volume: 98000 },
      { pair: 'MSFT', price: 378.92, change: 4.56, changePercent: 1.22, high: 380.45, low: 375.23, spread: 0.04, volume: 156000 },
      { pair: 'TSLA', price: 234.56, change: -3.21, changePercent: -1.35, high: 238.77, low: 232.11, spread: 0.05, volume: 67000 },
      { pair: 'AMZN', price: 151.23, change: 1.87, changePercent: 1.25, high: 152.34, low: 149.45, spread: 0.03, volume: 78000 },
      { pair: 'NVDA', price: 456.78, change: 12.34, changePercent: 2.78, high: 459.12, low: 445.67, spread: 0.06, volume: 54000 },
    ];

    const mockNews: MarketNews[] = [
      { id: '1', title: 'Apple Announces New Product Launch Event', impact: 'high', time: '2 hours ago', currency: 'AAPL' },
      { id: '2', title: 'Google Reports Strong Q4 Earnings', impact: 'high', time: '4 hours ago', currency: 'GOOGL' },
      { id: '3', title: 'Microsoft Azure Growth Exceeds Expectations', impact: 'medium', time: '6 hours ago', currency: 'MSFT' },
      { id: '4', title: 'Tesla Production Numbers Beat Estimates', impact: 'high', time: '8 hours ago', currency: 'TSLA' },
    ];

    setMarketData(mockData);
    setNews(mockNews);
  };

  const getChangeClass = (change: number) => {
    if (change > 0) return 'price-up';
    if (change < 0) return 'price-down';
    return 'price-neutral';
  };

  const getImpactClass = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const refreshData = () => {
    if (apiConnected) {
      fetchLiveData();
    } else {
      initializeMarketData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Live Markets</h1>
            <p className="text-slate-400">
              {/* ✅ Updated API name */}
              {apiConnected ? 'Real-time stock data via Finnhub' : 'Demo data (API connection failed)'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={refreshData}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors"
            >
              Refresh
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${apiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-slate-300">
                {apiConnected ? 'Live Data' : 'Demo Mode'}
              </span>
            </div>
            <div className="text-sm text-slate-400">
              Welcome, {(user?.user_metadata as any)?.full_name || user?.email}
            </div>
          </div>
        </div>
        
        {/* Error Banner */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Data Source</h3>
              <div className={`w-3 h-3 rounded-full animate-pulse ${apiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </div>
            <p className={`text-3xl font-bold ${apiConnected ? 'text-green-400' : 'text-yellow-400'}`}>
              {apiConnected ? 'LIVE' : 'DEMO'}
            </p>
            <p className="text-sm text-slate-400">
              {/* ✅ Updated API name */}
              {apiConnected ? 'Finnhub API' : 'Using mock data'}
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Most Active</h3>
            <p className="text-2xl font-bold text-cyan-400">
              {marketData.length > 0 ? marketData[0].pair : 'AAPL'}
            </p>
            <p className="text-sm text-slate-400">
              Volume: {marketData.length > 0 ? marketData[0].volume.toLocaleString() : '0'} shares
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Stocks Tracked</h3>
            <p className="text-2xl font-bold text-yellow-400">{marketData.length}</p>
            <p className="text-sm text-slate-400">Major US stocks</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Quotes */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Major US Stocks</h2>
              {apiConnected && (
                <div className="text-xs text-slate-400">
                  Updates every 30s
                </div>
              )}
            </div>
            <div className="space-y-3">
              {marketData.map((stock) => (
                <div
                  key={stock.pair}
                  className={`forex-pair ${selectedPair === stock.pair ? 'border-cyan-400' : ''}`}
                  onClick={() => setSelectedPair(stock.pair)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold">{stock.pair}</div>
                      <div className="text-2xl font-mono">${stock.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getChangeClass(stock.change)}`}>
                        {stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}
                      </div>
                      <div className={`text-sm ${getChangeClass(stock.change)}`}>
                        {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">High:</span>
                      <div className="font-mono">${stock.high.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Low:</span>
                      <div className="font-mono">${stock.low.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Spread:</span>
                      <div className={`font-mono ${stock.spread < 0.05 ? 'spread-tight' : 'spread-wide'}`}>
                        ${stock.spread.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Volume:</span>
                      <div className="font-mono">{stock.volume.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Status Card */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">API Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Finnhub API</span>
                  <span className={`text-sm font-bold ${apiConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {apiConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Updates</span>
                  <span className="text-sm text-slate-400">
                    {apiConnected ? 'Real-time' : 'Static'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Update</span>
                  <span className="text-sm text-slate-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Market News */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Market News</h3>
              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="border-l-4 border-slate-600 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${getImpactClass(item.impact)}`}></span>
                          <span className="text-xs text-slate-400 uppercase">{item.impact} impact</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 ml-2">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Signals */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">AI Signals</h3>
              <div className="space-y-3">
                <div className="trading-card bullish">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">AAPL</span>
                    <span className="analysis-indicator indicator-buy">BUY</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">Strong bullish momentum detected</p>
                </div>
                
                <div className="trading-card bearish">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">TSLA</span>
                    <span className="analysis-indicator indicator-sell">SELL</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">Resistance at $240 level</p>
                </div>

                <div className="trading-card neutral">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">MSFT</span>
                    <span className="analysis-indicator indicator-hold">HOLD</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">Consolidation pattern forming</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn-primary w-full">Ask AI About Market</button>
                <button className="btn-secondary w-full">Set Price Alert</button>
                <button className="btn-secondary w-full">View Analysis</button>
                <button 
                  onClick={refreshData}
                  className="btn-secondary w-full"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedPair} Chart</h2>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm py-1 px-3">1H</button>
              <button className="btn-secondary text-sm py-1 px-3">4H</button>
              <button className="btn-primary text-sm py-1 px-3">1D</button>
              <button className="btn-secondary text-sm py-1 px-3">1W</button>
            </div>
          </div>
          <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-slate-400">Chart for {selectedPair}</p>
              <p className="text-sm text-slate-500">
                {apiConnected ? 'Real-time data available' : 'Demo mode'} - Chart integration coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketsPage;