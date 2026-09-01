'use client';

import { useState } from 'react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');

  const generate = () => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };
    let pool = '';
    if (options.uppercase) pool += chars.uppercase;
    if (options.lowercase) pool += chars.lowercase;
    if (options.numbers) pool += chars.numbers;
    if (options.symbols) pool += chars.symbols;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool[Math.floor(Math.random() * pool.length)];
    }
    setPassword(result);
  };

  const strength = password.length > 12 ? 'Strong' : password.length > 8 ? 'Medium' : 'Weak';
  const strengthColor = strength === 'Strong' ? 'text-green-600' : strength === 'Medium' ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">🔒 Password Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate secure, random passwords instantly.</p>
      </div>

      <div className="card p-8">
        {/* Generated Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Generated Password</label>
          <div className="flex gap-2">
            <input readOnly value={password} className="flex-1 px-4 py-3 bg-gray-100 dark:bg-dark-bg border rounded-lg font-mono text-lg" placeholder="Click generate..." />
            <button onClick={() => navigator.clipboard.writeText(password)} className="px-4 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg hover:bg-gray-200 text-sm">
              Copy
            </button>
          </div>
          {password && <p className={`text-sm mt-2 font-medium ${strengthColor}`}>Strength: {strength}</p>}
        </div>

        {/* Length */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Length: {length}</label>
          <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(options).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={val} onChange={(e) => setOptions({ ...options, [key]: e.target.checked })} className="rounded" />
              <span className="text-sm capitalize">{key}</span>
            </label>
          ))}
        </div>

        <button onClick={generate} className="w-full btn-primary py-3">Generate Password</button>
      </div>
    </div>
  );
}
