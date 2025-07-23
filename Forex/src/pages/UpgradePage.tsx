import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';
import Layout from '../components/Layout';

const UpgradePage: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro'>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        '10 AI queries per day',
        'Basic market data',
        'Email support',
        'Community access',
      ],
      limitations: [
        'Limited chat history',
        'No priority support',
        'Basic analysis only',
      ],
    },
    premium: {
      name: 'Premium',
      price: { monthly: 29, yearly: 290 },
      features: [
        '500 AI queries per day',
        'Real-time market data',
        'Advanced technical analysis',
        'Trading signals',
        'Priority email support',
        'Extended chat history',
        'Risk management tools',
        'Economic calendar',
      ],
      popular: true,
    },
    pro: {
      name: 'Professional',
      price: { monthly: 99, yearly: 990 },
      features: [
        'Unlimited AI queries',
        'Premium market data feeds',
        'Advanced AI models',
        'Custom trading strategies',
        'Phone & chat support',
        'API access',
        'Portfolio analysis',
        'Institutional-grade tools',
        'White-label options',
        'Dedicated account manager',
      ],
    },
  };

  const handleUpgrade = async (planType: 'premium' | 'pro') => {
    // In a real application, this would integrate with PayPal
    // For now, we'll just show an alert
    alert(`Upgrading to ${planType} plan. PayPal integration would be implemented here.`);
  };

  const currentPlan = userProfile?.subscription_tier || 'free';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Trading Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock advanced AI-powered forex analysis and take your trading to the next level
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <div className={`card relative ${currentPlan === 'free' ? 'ring-2 ring-primary-500' : ''}`}>
            {currentPlan === 'free' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900">
                $0
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {plans.free.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              disabled={currentPlan === 'free'}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className={`card relative ${
            plans.premium.popular ? 'ring-2 ring-primary-500 scale-105' : ''
          } ${currentPlan === 'premium' ? 'ring-2 ring-primary-500' : ''}`}>
            {plans.premium.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Most Popular
                </span>
              </div>
            )}
            {currentPlan === 'premium' && (
              <div className="absolute -top-3 right-4">
                <span className="bg-success-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Crown className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                ${plans.premium.price[billingCycle]}
                <span className="text-lg font-normal text-gray-600">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-success-600 mt-1">Save $58/year</p>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {plans.premium.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade('premium')}
              disabled={currentPlan === 'premium'}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`card relative ${currentPlan === 'pro' ? 'ring-2 ring-primary-500' : ''}`}>
            {currentPlan === 'pro' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-2xl font-bold text-gray-900">Professional</h3>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                ${plans.pro.price[billingCycle]}
                <span className="text-lg font-normal text-gray-600">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-success-600 mt-1">Save $198/year</p>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              {plans.pro.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={currentPlan === 'pro'}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Feature Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    AI Queries per Day
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">500</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Real-time Market Data
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Basic</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <Check className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <Check className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Trading Signals
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <Check className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <Check className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    API Access
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <Check className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Support Level
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Email</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Priority Email</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Phone & Chat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Our free plan gives you access to basic features. You can upgrade to premium features anytime.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards and PayPal for secure and convenient payments.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Yes, we use enterprise-grade security measures to protect your data and trading information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpgradePage;