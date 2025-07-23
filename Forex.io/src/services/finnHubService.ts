// Handle environment variables for Vite
const API_KEY = (import.meta as any).env?.VITE_FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';

// Keep your existing interfaces - no changes needed!
export interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  is_market_open: boolean;
  fifty_two_week: {
    low: string;
    high: string;
    low_change: string;
    high_change: string;
    low_change_percent: string;
    high_change_percent: string;
    range: string;
  };
}

export interface CurrencyPair {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  spread: number;
  volume: number;
}

// Finnhub API response interfaces
interface FinnhubQuote {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;  // high price of the day
  l: number;  // low price of the day
  o: number;  // open price of the day
  pc: number; // previous close price
  t: number;  // timestamp
}

interface FinnhubProfile {
  country: string;
  currency: string;
  exchange: string;
  name: string;
  ticker: string;
  ipo: string;
  marketCapitalization: number;
  shareOutstanding: number;
  logo: string;
  phone: string;
  weburl: string;
}

interface FinnhubCandle {
  c: number[]; // close prices
  h: number[]; // high prices
  l: number[]; // low prices
  o: number[]; // open prices
  s: string;   // status
  t: number[]; // timestamps
  v: number[]; // volumes
}

class FinnhubService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY || '';
    if (!this.apiKey) {
      console.error('Finnhub API key not found. Please check your environment variables.');
    }
  }

  // Get real-time quote for a single symbol - matches your existing method signature
  async getQuote(symbol: string): Promise<TwelveDataQuote> {
    try {
      // Get both quote and profile data to match TwelveData format
      const [quoteResponse, profileResponse] = await Promise.all([
        fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${this.apiKey}`),
        fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${this.apiKey}`)
      ]);
      
      if (!quoteResponse.ok || !profileResponse.ok) {
        throw new Error(`HTTP error! quote: ${quoteResponse.status}, profile: ${profileResponse.status}`);
      }
      
      const quoteData: FinnhubQuote = await quoteResponse.json();
      const profileData: FinnhubProfile = await profileResponse.json();
      
      // Convert Finnhub response to match TwelveData format
      return this.convertFinnhubToTwelveDataFormat(quoteData, profileData, symbol);
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  // Get quotes for multiple symbols - matches your existing method signature
  async getMultipleQuotes(symbols: string[]): Promise<TwelveDataQuote[]> {
    try {
      // Finnhub doesn't support bulk quotes, so we'll make parallel requests
      const promises = symbols.map(symbol => this.getQuote(symbol));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      throw error;
    }
  }

  // Get time series data for charting - matches your existing method signature
  async getTimeSeries(symbol: string, interval: string = '1min', outputsize: number = 30) {
    try {
      // Convert interval to Finnhub format
      const resolution = this.convertIntervalToResolution(interval);
      
      // Calculate date range based on outputsize
      const to = Math.floor(Date.now() / 1000);
      const from = to - (outputsize * this.getSecondsForResolution(resolution));
      
      const response = await fetch(
        `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FinnhubCandle = await response.json();
      
      if (data.s === 'no_data') {
        throw new Error('No data available for the specified period');
      }
      
      // Convert to TwelveData format
      return this.convertCandleDataToTwelveDataFormat(data, symbol);
    } catch (error) {
      console.error(`Error fetching time series for ${symbol}:`, error);
      throw error;
    }
  }

  // Convert to your existing CurrencyPair format - matches your existing method signature
  convertToLocalFormat(quote: TwelveDataQuote): CurrencyPair {
    const price = parseFloat(quote.close);
    const change = parseFloat(quote.change);
    const changePercent = parseFloat(quote.percent_change);
    const high = parseFloat(quote.high);
    const low = parseFloat(quote.low);
    const volume = parseInt(quote.volume) || 0;

    return {
      pair: quote.symbol,
      price,
      change,
      changePercent,
      high,
      low,
      spread: this.calculateSpread(price, quote.symbol),
      volume
    };
  }

  // Get market status - matches your existing method signature
  async getMarketStatus() {
    try {
      // Finnhub doesn't have a direct market status endpoint
      // We'll simulate this by checking if we can get a quote for a major symbol
      const testSymbol = 'AAPL';
      const response = await fetch(
        `${BASE_URL}/quote?symbol=${testSymbol}&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FinnhubQuote = await response.json();
      
      // Return a format similar to TwelveData
      return {
        status: 'ok',
        market_state: data.t > 0 ? 'open' : 'closed',
        timestamp: data.t
      };
    } catch (error) {
      console.error('Error fetching market status:', error);
      throw error;
    }
  }

  // Test API connection - matches your existing method signature
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${BASE_URL}/quote?symbol=AAPL&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.c !== undefined; // Finnhub returns 'c' for current price
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Private helper methods
  private convertFinnhubToTwelveDataFormat(
    quoteData: FinnhubQuote, 
    profileData: FinnhubProfile, 
    symbol: string
  ): TwelveDataQuote {
    const timestamp = quoteData.t;
    const datetime = new Date(timestamp * 1000).toISOString();
    
    return {
      symbol: symbol,
      name: profileData.name || symbol,
      exchange: profileData.exchange || 'NASDAQ',
      mic_code: profileData.exchange || 'XNAS',
      currency: profileData.currency || 'USD',
      datetime: datetime,
      timestamp: timestamp,
      open: quoteData.o.toString(),
      high: quoteData.h.toString(),
      low: quoteData.l.toString(),
      close: quoteData.c.toString(),
      volume: '0', // Finnhub quote doesn't include volume
      previous_close: quoteData.pc.toString(),
      change: quoteData.d.toString(),
      percent_change: quoteData.dp.toString(),
      average_volume: '0', // Not available in Finnhub quote
      is_market_open: this.isMarketOpen(timestamp),
      fifty_two_week: {
        low: '0', // Not available in basic quote
        high: '0',
        low_change: '0',
        high_change: '0',
        low_change_percent: '0',
        high_change_percent: '0',
        range: '0-0'
      }
    };
  }

  private convertCandleDataToTwelveDataFormat(data: FinnhubCandle, symbol: string) {
    const values = data.t.map((timestamp, index) => ({
      datetime: new Date(timestamp * 1000).toISOString(),
      open: data.o[index].toString(),
      high: data.h[index].toString(),
      low: data.l[index].toString(),
      close: data.c[index].toString(),
      volume: data.v[index].toString()
    }));

    return {
      meta: {
        symbol: symbol,
        interval: '1min',
        currency: 'USD',
        exchange_timezone: 'America/New_York',
        exchange: 'NASDAQ',
        mic_code: 'XNAS',
        type: 'Common Stock'
      },
      values: values,
      status: 'ok'
    };
  }

  private convertIntervalToResolution(interval: string): string {
    const intervalMap: { [key: string]: string } = {
      '1min': '1',
      '5min': '5',
      '15min': '15',
      '30min': '30',
      '45min': '60', // Finnhub doesn't have 45min, use 60min
      '1h': '60',
      '2h': '120', // Not standard, might need adjustment
      '4h': '240', // Not standard, might need adjustment
      '1day': 'D',
      '1week': 'W',
      '1month': 'M'
    };
    
    return intervalMap[interval] || '1';
  }

  private getSecondsForResolution(resolution: string): number {
    const resolutionSeconds: { [key: string]: number } = {
      '1': 60,      // 1 minute
      '5': 300,     // 5 minutes
      '15': 900,    // 15 minutes
      '30': 1800,   // 30 minutes
      '60': 3600,   // 1 hour
      '120': 7200,  // 2 hours
      '240': 14400, // 4 hours
      'D': 86400,   // 1 day
      'W': 604800,  // 1 week
      'M': 2592000  // 1 month (approx)
    };
    
    return resolutionSeconds[resolution] || 60;
  }

  private calculateSpread(price: number, symbol: string): number {
    // Enhanced spread calculation using symbol
    const majorPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'];
    const majorStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    
    if (majorPairs.includes(symbol)) {
      return 0.8 + Math.random() * 0.8; // 0.8-1.6 pips for major pairs
    } else if (majorStocks.includes(symbol)) {
      return 0.01 + Math.random() * 0.02; // $0.01-0.03 for major stocks
    } else {
      return 1.5 + Math.random() * 1.5; // 1.5-3.0 pips for minor pairs/stocks
    }
  }

  private isMarketOpen(timestamp: number): boolean {
    const date = new Date(timestamp * 1000);
    const hours = date.getUTCHours();
    const dayOfWeek = date.getUTCDay();
    
    // Simple check for US market hours (9:30 AM - 4:00 PM ET = 14:30 - 21:00 UTC)
    // This is a rough approximation
    return dayOfWeek >= 1 && dayOfWeek <= 5 && hours >= 14 && hours < 21;
  }
}

export const finnhubService = new FinnhubService();