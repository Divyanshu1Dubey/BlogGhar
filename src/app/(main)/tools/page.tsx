'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';

const TOOL_ITEMS = [
  { name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Calculate your Body Mass Index', url: 'https://blogghar.com/tools/bmi-calculator' },
  { name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate exact age', url: 'https://blogghar.com/tools/age-calculator' },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Calculate percentages', url: 'https://blogghar.com/tools/percentage-calculator' },
  { name: 'EMI Calculator', slug: 'emi-calculator', description: 'Calculate loan EMI', url: 'https://blogghar.com/tools/emi-calculator' },
  { name: 'GST Calculator', slug: 'gst-calculator', description: 'Calculate GST in India', url: 'https://blogghar.com/tools/gst-calculator' },
  { name: 'Compound Interest', slug: 'compound-interest', description: 'Calculate compound interest', url: 'https://blogghar.com/tools/compound-interest' },
  { name: 'Date Difference', slug: 'date-difference', description: 'Days between dates', url: 'https://blogghar.com/tools/date-difference' },
  { name: 'GPA Calculator', slug: 'gpa-calculator', description: 'Calculate GPA', url: 'https://blogghar.com/tools/gpa-calculator' },
  { name: 'Tip Calculator', slug: 'tip-calculator', description: 'Calculate tip & split bill', url: 'https://blogghar.com/tools/tip-calculator' },
  { name: 'Discount Calculator', slug: 'discount-calculator', description: 'Calculate discount', url: 'https://blogghar.com/tools/discount-calculator' },
  { name: 'Time Zone Converter', slug: 'timezone-converter', description: 'Convert time zones', url: 'https://blogghar.com/tools/timezone-converter' },
  { name: 'Currency Converter', slug: 'currency-converter', description: 'Convert currencies', url: 'https://blogghar.com/tools/currency-converter' },
  { name: 'Length Converter', slug: 'length-converter', description: 'Convert length units', url: 'https://blogghar.com/tools/length-converter' },
  { name: 'Weight Converter', slug: 'weight-converter', description: 'Convert weight units', url: 'https://blogghar.com/tools/weight-converter' },
  { name: 'Temperature Converter', slug: 'temperature-converter', description: 'Convert temperature', url: 'https://blogghar.com/tools/temperature-converter' },
  { name: 'Speed Converter', slug: 'speed-converter', description: 'Convert speed units', url: 'https://blogghar.com/tools/speed-converter' },
  { name: 'Area Converter', slug: 'area-converter', description: 'Convert area units', url: 'https://blogghar.com/tools/area-converter' },
  { name: 'Number to Words', slug: 'number-to-words', description: 'Numbers to words', url: 'https://blogghar.com/tools/number-to-words' },
  { name: 'Roman Numeral', slug: 'roman-numeral', description: 'Roman numeral converter', url: 'https://blogghar.com/tools/roman-numeral' },
  { name: 'Word Counter', slug: 'word-counter', description: 'Count words & chars', url: 'https://blogghar.com/tools/word-counter' },
  { name: 'Text Case Converter', slug: 'text-case-converter', description: 'Convert text case', url: 'https://blogghar.com/tools/text-case-converter' },
  { name: 'JSON Formatter', slug: 'json-formatter', description: 'Format & validate JSON', url: 'https://blogghar.com/tools/json-formatter' },
  { name: 'Password Generator', slug: 'password-generator', description: 'Generate passwords', url: 'https://blogghar.com/tools/password-generator' },
  { name: 'UUID Generator', slug: 'uuid-generator', description: 'Generate UUIDs', url: 'https://blogghar.com/tools/uuid-generator' },
  { name: 'Markdown Editor', slug: 'markdown-editor', description: 'Write & preview markdown', url: 'https://blogghar.com/tools/markdown-editor' },
  { name: 'Online Notepad', slug: 'online-notepad', description: 'Quick online notepad', url: 'https://blogghar.com/tools/online-notepad' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Generate QR codes', url: 'https://blogghar.com/tools/qr-code-generator' },
  { name: 'Color Palette', slug: 'color-palette', description: 'Generate color palettes', url: 'https://blogghar.com/tools/color-palette' },
  { name: 'Base64 Encoder', slug: 'base64-encoder', description: 'Encode/decode Base64', url: 'https://blogghar.com/tools/base64-encoder' },
  { name: 'Hash Generator', slug: 'hash-generator', description: 'Generate MD5, SHA256', url: 'https://blogghar.com/tools/hash-generator' },
];

const categories: Record<string, string[]> = {
  'Calculators': ['bmi-calculator', 'age-calculator', 'percentage-calculator', 'emi-calculator', 'gst-calculator', 'compound-interest', 'date-difference', 'gpa-calculator', 'tip-calculator', 'discount-calculator', 'timezone-converter'],
  'Converters': ['currency-converter', 'length-converter', 'weight-converter', 'temperature-converter', 'speed-converter', 'area-converter', 'number-to-words', 'roman-numeral'],
  'Text Tools': ['word-counter', 'text-case-converter', 'json-formatter', 'password-generator', 'uuid-generator', 'markdown-editor', 'online-notepad'],
  'Dev Tools': ['qr-code-generator', 'color-palette', 'base64-encoder', 'hash-generator'],
};

export const metadata: Metadata = {
  title: '30+ Free Online Tools | Blog-Ghar',
  description: 'Access 30+ free online tools — calculators, converters, generators, and text utilities. No registration required.',
  keywords: ['online tools', 'free tools', 'calculator', 'converter', 'BMI calculator', 'EMI calculator', 'QR code generator', 'password generator', 'JSON formatter', 'text tools'],
  alternates: { canonical: 'https://blogghar.com/tools' },
};

const toolListSchema = TOOL_ITEMS.map((tool, i) => ({
  '@type': 'ListItem',
  position: i + 1,
  name: tool.name,
  url: tool.url,
}));

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = (slugs: string[]) => TOOL_ITEMS.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return slugs.includes(t.slug);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">🔧 Free Online Tools</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">30+ free online tools — no registration required!</p>
      </div>

      <div className="max-w-xl mx-auto mb-6">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools..." className="w-full px-4 py-3 border rounded-xl dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-lg font-medium text-sm ${!activeCategory ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-card'}`}>All</button>
        {Object.keys(categories).map(cat => (
          <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} className={`px-4 py-2 rounded-lg font-medium text-sm ${activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-card'}`}>{cat}</button>
        ))}
      </div>

      {Object.entries(categories).map(([cat, slugs]) => {
        const ft = filtered(slugs);
        if (activeCategory && activeCategory !== cat) return null;
        if (ft.length === 0) return null;
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">{cat} <span className="text-gray-400 text-lg">({ft.length})</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ft.map((tool) => (
                <a key={tool.slug} href={tool.url} className="card p-5 group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <div>
                    <h3 className="font-medium group-hover:text-primary-600 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      <JsonLd type="ItemList" data={{
        name: 'Blog-Ghar Free Online Tools',
        description: '30+ free online tools including calculators, converters, generators, and text utilities.',
        url: 'https://blogghar.com/tools',
        numberOfItems: TOOL_ITEMS.length,
        itemListElement: toolListSchema,
      }} />
    </div>
  );
}
