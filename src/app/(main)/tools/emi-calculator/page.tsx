'use client';

import { useState } from 'react';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState;
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [result, setResult] = useState<{ emi: number; total: number; interest: number } | null>(null);

  const calculate = () => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - principal;
    setResult({ emi: parseFloat(emi.toFixed(2)), total: parseFloat(total.toFixed(2)), interest: parseFloat(interest.toFixed(2)) });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">🏦 EMI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">Calculate your loan EMI and total interest payable.</p>
      </div>
      <div className="card p-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Loan Amount (₹)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Interest Rate (% per year)</label>
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Loan Tenure (years)</label>
            <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" />
          </div>
        </div>
        <button onClick={calculate} className="w-full btn-primary py-3 mt-6">Calculate EMI</button>
        {result && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
              <p className="text-sm text-gray-500">Monthly EMI</p>
              <p className="text-2xl font-bold text-primary-600">₹{result.emi.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="text-2xl font-bold text-green-600">₹{result.interest.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <p className="text-sm text-gray-500">Total Payment</p>
              <p className="text-2xl font-bold text-blue-600">₹{result.total.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
