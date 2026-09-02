'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Calculator',
  description: 'Calculate percentages online free. Find percentage of a number, increase/decrease percentage, and more.',
  openGraph: { title: 'Percentage Calculator', description: 'Calculate percentages online free.', type: 'website' },
};

export default function PercentageCalculator() {
  const [mode, setMode] = useState<'simple' | 'change' | 'increase'>('simple');
  const [values, setValues] = useState({ percentage: 10, number: 100, result: 0 });

  const calculate = () => {
    const { percentage, number } = values;
    let result = 0;
    switch (mode) {
      case 'simple': result = (percentage / 100) * number; break;
      case 'change': result = number - (percentage / 100) * number; break;
      case 'increase': result = number + (percentage / 100) * number; break;
    }
    setValues({ ...values, result: parseFloat(result.toFixed(2)) });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">% Percentage Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">Calculate percentages, changes, and increases easily.</p>
      </div>

      <div className="card p-8">
        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'simple', label: 'What is X% of Y?' },
            { id: 'change', label: 'X% off Y' },
            { id: 'increase', label: 'X% increase Y' },
          ].map((m) => (
            <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === m.id ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {mode === 'simple' ? 'What is' : mode === 'change' ? 'Discount' : 'Increase'} {mode !== 'simple' ? '' : 'X ='} percentage (%)
            </label>
            <input type="number" value={values.percentage} onChange={(e) => setValues({ ...values, percentage: Number(e.target.value) })} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {mode === 'simple' ? 'of Y = number' : 'Original amount (Y)'}
            </label>
            <input type="number" value={values.number} onChange={(e) => setValues({ ...values, number: Number(e.target.value) })} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" />
          </div>
        </div>

        <button onClick={calculate} className="w-full btn-primary py-3 mb-6">Calculate</button>

        {values.result > 0 && (
          <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
            <p className="text-sm text-gray-500 mb-1">Result</p>
            <p className="text-4xl font-bold font-display text-primary-600">{values.result.toLocaleString()}</p>
            {mode === 'change' && <p className="text-sm text-gray-500 mt-2">You save: {values.percentage}% = {values.result.toLocaleString()}</p>}
            {mode === 'increase' && <p className="text-sm text-gray-500 mt-2">Increase: {(values.result - values.number).toLocaleString()}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
