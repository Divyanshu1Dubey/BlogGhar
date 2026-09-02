'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Counter',
  description: 'Count words, characters, sentences, and paragraphs online free.',
  openGraph: { title: 'Word Counter', description: 'Count words, characters, and more online free.', type: 'website' },
};

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.trim() ? (text.match(/[.!?]+/g) || []).length || 1 : 0,
    paragraphs: text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0,
    lines: text.trim() ? text.split('\n').length : 0,
  };

  const readTime = Math.ceil(stats.words / 200);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">📝 Word Counter</h1>
        <p className="text-gray-600 dark:text-gray-400">Count words, characters, sentences & more. Free online.</p>
      </div>

      <div className="card p-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-base leading-relaxed"
        />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-primary-600">{stats.words}</p>
            <p className="text-xs text-gray-500">Words</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.characters}</p>
            <p className="text-xs text-gray-500">Characters</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-green-600">{stats.charactersNoSpaces}</p>
            <p className="text-xs text-gray-500">No Spaces</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.sentences}</p>
            <p className="text-xs text-gray-500">Sentences</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.paragraphs}</p>
            <p className="text-xs text-gray-500">Paragraphs</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
            <p className="text-2xl font-bold text-orange-600">{readTime}</p>
            <p className="text-xs text-gray-500">Min Read</p>
          </div>
        </div>

        {text && (
          <button onClick={() => setText('')} className="mt-4 text-sm text-red-500 hover:underline">
            Clear Text
          </button>
        )}
      </div>
    </div>
  );
}
