'use client';

import { useState } from 'react';

export default function TextCaseConverter() {
  const [text, setText] = useState('');

  const conversions = {
    UPPERCASE: text.toUpperCase(),
    lowercase: text.toLowerCase(),
    Title: text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
    camelCase: text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()),
    snake_case: text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, ''),
    kebab: text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, ''),
    Sentence: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
  };

  const copy = (val: string) => navigator.clipboard.writeText(val);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">Aa Text Case Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">Convert text to different cases instantly.</p>
      </div>
      <div className="card p-8">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none mb-4" />
        <div className="space-y-3">
          {Object.entries(conversions).map(([label, value]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-24 text-sm font-medium text-gray-500 shrink-0">{label}</span>
              <input readOnly value={value} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg text-sm" />
              <button onClick={() => copy(value)} className="px-3 py-1 text-xs bg-gray-200 dark:bg-dark-border rounded hover:bg-gray-300">Copy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
