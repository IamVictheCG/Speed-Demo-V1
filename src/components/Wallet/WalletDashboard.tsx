import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  History,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export const WalletDashboard: React.FC = () => {
  const { wallet, addTransaction } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addTransaction({
      type: 'credit',
      amount: parseFloat(topUpAmount),
      description: 'Wallet top-up',
      status: 'completed'
    });
    
    setTopUpAmount('');
    setShowTopUp(false);
    setLoading(false);
  };

  const quickAmounts = [20, 50, 100, 200];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <Button onClick={() => setShowTopUp(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Top Up
        </Button>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Available Balance</p>
            <p className="text-4xl font-bold mt-2">${wallet?.balance.toFixed(2) || '0.00'}</p>
          </div>
          <div className="text-right">
            <Wallet className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-lg font-semibold text-gray-900">$125.50</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Added</p>
              <p className="text-lg font-semibold text-gray-900">$450.00</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
              <ArrowDownLeft className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-lg font-semibold text-gray-900">$324.50</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Up Wallet</h3>
              <button
                onClick={() => setShowTopUp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Quick amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="py-2 px-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Payment Method</p>
                  <p className="text-sm text-blue-700">**** **** **** 1234</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTopUp(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTopUp}
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? 'Processing...' : 'Top Up'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Transaction History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <History className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {wallet?.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <p className={`text-xs ${
                  transaction.status === 'completed' ? 'text-green-600' : 
                  transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};