'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age Calculator',
  description: 'Calculate your exact age in years, months, and days. Free online age calculator.',
  openGraph: { title: 'Age Calculator', description: 'Calculate your exact age in years, months, and days.', type: 'website' },
};

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number; totalMonths: number; nextBirthday: number } | null>(null);

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    // Next birthday
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) {
      nextBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays, totalMonths, nextBirthday: daysUntilBirthday });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">🎂 Age Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">Calculate your exact age from your date of birth.</p>
      </div>

      <div className="card p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <button onClick={calculate} className="w-full btn-primary py-3 mb-6">
          Calculate Age
        </button>

        {result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
              <p className="text-3xl font-bold text-primary-600">{result.years}</p>
              <p className="text-sm text-gray-600">Years</p>
            </div>
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
              <p className="text-3xl font-bold text-primary-600">{result.months}</p>
              <p className="text-sm text-gray-600">Months</p>
            </div>
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
              <p className="text-3xl font-bold text-primary-600">{result.days}</p>
              <p className="text-sm text-gray-600">Days</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <p className="text-3xl font-bold text-green-600">{result.nextBirthday}</p>
              <p className="text-sm text-gray-600">Days to Next B'day</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="text-xl font-bold">{result.totalDays.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Days</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="text-xl font-bold">{result.totalMonths.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Months</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
