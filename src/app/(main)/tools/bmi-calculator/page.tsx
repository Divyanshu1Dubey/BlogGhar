'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator',
  description: 'Calculate your Body Mass Index (BMI) free online. Supports metric (kg/cm) and imperial (ft/lbs) units.',
  openGraph: { title: 'BMI Calculator', description: 'Calculate your Body Mass Index free online.', type: 'website' },
};

export default function BMICalculator() {
  const [height, setHeight] = useState({ feet: 5, inches: 7 });
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState<number | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const calculateBMI = () => {
    let bmiValue: number;
    if (unit === 'metric') {
      const heightM = height.feet / 100; // reusing for cm
      bmiValue = weight / ((heightM) ** 2);
    } else {
      const totalInches = height.feet * 12 + height.inches;
      bmiValue = (weight / (totalInches ** 2)) * 703;
    }
    setBmi(parseFloat(bmiValue.toFixed(1)));
  };

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 bg-blue-50' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-green-600 bg-green-50' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Obese', color: 'text-red-600 bg-red-50' };
  };

  const category = bmi ? getCategory(bmi) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">⚖️ BMI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your Body Mass Index to understand your health status.
        </p>
      </div>

      <div className="card p-8">
        {/* Unit Toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setUnit('metric')} className={`flex-1 py-2 rounded-lg font-medium ${unit === 'metric' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>
            Metric (kg/cm)
          </button>
          <button onClick={() => setUnit('imperial')} className={`flex-1 py-2 rounded-lg font-medium ${unit === 'imperial' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>
            Imperial (ft/lbs)
          </button>
        </div>

        {/* Height Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Height</label>
          {unit === 'metric' ? (
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={height.feet}
                onChange={(e) => setHeight({ ...height, feet: Number(e.target.value) })}
                className="w-32 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg"
                placeholder="cm"
              />
              <span className="text-gray-500">cm</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={height.feet}
                onChange={(e) => setHeight({ ...height, feet: Number(e.target.value) })}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg"
                placeholder="ft"
              />
              <span className="text-gray-500">ft</span>
              <input
                type="number"
                value={height.inches}
                onChange={(e) => setHeight({ ...height, inches: Number(e.target.value) })}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg"
                placeholder="in"
              />
              <span className="text-gray-500">in</span>
            </div>
          )}
        </div>

        {/* Weight Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Weight</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-32 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg"
            />
            <span className="text-gray-500">{unit === 'metric' ? 'kg' : 'lbs'}</span>
          </div>
        </div>

        <button onClick={calculateBMI} className="w-full btn-primary py-3 mb-6">
          Calculate BMI
        </button>

        {/* Result */}
        {bmi && category && (
          <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-xl text-center animate-in">
            <p className="text-sm text-gray-500 mb-1">Your BMI</p>
            <p className="text-5xl font-bold font-display text-primary-600 mb-2">{bmi}</p>
            <span className={`inline-block px-4 py-1.5 rounded-full font-medium ${category.color}`}>
              {category.label}
            </span>
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><p className="font-medium text-blue-700">&lt;18.5</p><p className="text-blue-600">Under</p></div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><p className="font-medium text-green-700">18.5-24.9</p><p className="text-green-600">Normal</p></div>
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"><p className="font-medium text-yellow-700">25-29.9</p><p className="text-yellow-600">Over</p></div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"><p className="font-medium text-red-700">&gt;30</p><p className="text-red-600">Obese</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
