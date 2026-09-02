'use client';

import { useState } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools',
  description: '30+ free online tools including calculators, converters, and text tools. No registration required!',
  openGraph: { title: 'Free Online Tools', description: '30+ free online tools including calculators, converters, and text tools.', type: 'website' },
};

const tools = [
  { name: 'BMI Calculator', slug: 'bmi-calculator', icon: '⚖️', desc: 'Calculate your Body Mass Index', route: '/tools/bmi-calculator' },
  { name: 'Age Calculator', slug: 'age-calculator', icon: '🎂', desc: 'Calculate exact age', route: '/tools/age-calculator' },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', icon: '%', desc: 'Calculate percentages', route: '/tools/percentage-calculator' },
  { name: 'EMI Calculator', slug: 'emi-calculator', icon: '🏦', desc: 'Calculate loan EMI', route: '/tools/emi-calculator' },
  { name: 'GST Calculator', slug: 'gst-calculator', icon: '🧮', desc: 'Calculate GST in India', route: '/tools/gst-calculator' },
  { name: 'Compound Interest', slug: 'compound-interest', icon: '📈', desc: 'Calculate compound interest', route: '/tools/compound-interest' },
  { name: 'Date Difference', slug: 'date-difference', icon: '📅', desc: 'Days between dates', route: '/tools/date-difference' },
  { name: 'GPA Calculator', slug: 'gpa-calculator', icon: '🎓', desc: 'Calculate GPA', route: '/tools/gpa-calculator' },
  { name: 'Tip Calculator', slug: 'tip-calculator', icon: '💵', desc: 'Calculate tip & split bill', route: '/tools/tip-calculator' },
  { name: 'Discount Calculator', slug: 'discount-calculator', icon: '🏷️', desc: 'Calculate discount', route: '/tools/discount-calculator' },
  { name: 'Time Zone Converter', slug: 'timezone-converter', icon: '🌍', desc: 'Convert time zones', route: '/tools/timezone-converter' },
  { name: 'Currency Converter', slug: 'currency-converter', icon: '💱', desc: 'Convert currencies', route: '/tools/currency-converter' },
  { name: 'Length Converter', slug: 'length-converter', icon: '📏', desc: 'Convert length units', route: '/tools/length-converter' },
  { name: 'Weight Converter', slug: 'weight-converter', icon: '⚖️', desc: 'Convert weight units', route: '/tools/weight-converter' },
  { name: 'Temperature Converter', slug: 'temperature-converter', icon: '🌡️', desc: 'Convert temperature', route: '/tools/temperature-converter' },
  { name: 'Speed Converter', slug: 'speed-converter', icon: '🏎️', desc: 'Convert speed units', route: '/tools/speed-converter' },
  { name: 'Area Converter', slug: 'area-converter', icon: '📐', desc: 'Convert area units', route: '/tools/area-converter' },
  { name: 'Number to Words', slug: 'number-to-words', icon: '🔢', desc: 'Numbers to words', route: '/tools/number-to-words' },
  { name: 'Roman Numeral', slug: 'roman-numeral', icon: '🏛️', desc: 'Roman numeral converter', route: '/tools/roman-numeral' },
  { name: 'Word Counter', slug: 'word-counter', icon: '📝', desc: 'Count words & chars', route: '/tools/word-counter' },
  { name: 'Text Case Converter', slug: 'text-case-converter', icon: 'Aa', desc: 'Convert text case', route: '/tools/text-case-converter' },
  { name: 'JSON Formatter', slug: 'json-formatter', icon: '{ }', desc: 'Format & validate JSON', route: '/tools/json-formatter' },
  { name: 'Password Generator', slug: 'password-generator', icon: '🔒', desc: 'Generate passwords', route: '/tools/password-generator' },
  { name: 'UUID Generator', slug: 'uuid-generator', icon: '🔑', desc: 'Generate UUIDs', route: '/tools/uuid-generator' },
  { name: 'Markdown Editor', slug: 'markdown-editor', icon: '📋', desc: 'Write & preview markdown', route: '/tools/markdown-editor' },
  { name: 'Online Notepad', slug: 'online-notepad', icon: '📒', desc: 'Quick online notepad', route: '/tools/online-notepad' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', icon: '📱', desc: 'Generate QR codes', route: '/tools/qr-code-generator' },
  { name: 'Color Palette', slug: 'color-palette', icon: '🎨', desc: 'Generate color palettes', route: '/tools/color-palette' },
  { name: 'Base64 Encoder', slug: 'base64-encoder', icon: '🔤', desc: 'Encode/decode Base64', route: '/tools/base64-encoder' },
  { name: 'Hash Generator', slug: 'hash-generator', icon: '🔐', desc: 'Generate MD5, SHA256', route: '/tools/hash-generator' },
];

const categories: Record<string, string[]> = {
  'Calculators': ['bmi-calculator', 'age-calculator', 'percentage-calculator', 'emi-calculator', 'gst-calculator', 'compound-interest', 'date-difference', 'gpa-calculator', 'tip-calculator', 'discount-calculator', 'timezone-converter'],
  'Converters': ['currency-converter', 'length-converter', 'weight-converter', 'temperature-converter', 'speed-converter', 'area-converter', 'number-to-words', 'roman-numeral'],
  'Text Tools': ['word-counter', 'text-case-converter', 'json-formatter', 'password-generator', 'uuid-generator', 'markdown-editor', 'online-notepad'],
  'Dev Tools': ['qr-code-generator', 'color-palette', 'base64-encoder', 'hash-generator'],
};

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = (slugs: string[]) => tools.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
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
                <a key={tool.slug} href={tool.route} className="card p-5 group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-medium group-hover:text-primary-600 transition-colors">{tool.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
