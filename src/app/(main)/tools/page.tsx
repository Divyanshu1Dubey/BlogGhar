'use client';

import { useState } from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';

const TOOL_ITEMS = [
  { name: 'EMI Calculator', slug: 'emi-calculator', description: 'Calculate home, car, or personal loan EMI with amortization schedule', icon: '🏦' },
  { name: 'SIP Calculator', slug: 'sip-calculator', description: 'Calculate SIP returns with year-by-year growth projection', icon: '📈' },
  { name: 'Income Tax Calculator', slug: 'income-tax-india', description: 'Compare Old vs New tax regimes with HRA, 80C deductions', icon: '🇮🇳' },
  { name: 'Loan Affordability', slug: 'loan-affordability', description: 'Find out how much home or car loan you can actually afford', icon: '🏠' },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Calculate percentages, change, and difference', icon: '%' },
  { name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Calculate Body Mass Index and ideal weight range', icon: '⚖️' },
  { name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate exact age in years, months, and days', icon: '🎂' },
  { name: 'Date Difference', slug: 'date-difference', description: 'Calculate days, weeks, months between two dates', icon: '📅' },
  { name: 'GPA Calculator', slug: 'gpa-calculator', description: 'Calculate GPA from course grades and credit hours', icon: '🎓' },
  { name: 'Compound Interest', slug: 'compound-interest', description: 'Calculate compound interest with year-by-year growth', icon: '💰' },
  { name: 'Discount Calculator', slug: 'discount-calculator', description: 'Calculate discounted price and savings amount', icon: '🏷️' },
  { name: 'Tip Calculator', slug: 'tip-calculator', description: 'Calculate tip and split the bill among friends', icon: '💵' },
  { name: 'Multi-Unit Converter', slug: 'unit-converter', description: 'Convert length, weight, temperature, speed, and more', icon: '📏' },
  { name: 'Word Counter', slug: 'word-counter', description: 'Count words, characters, sentences, and reading time', icon: '📝' },
  { name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, validate, and minify JSON data', icon: '{ }' },
  { name: 'Password Generator', slug: 'password-generator', description: 'Generate strong passwords with strength indicator', icon: '🔒' },
  { name: 'Base64 Encoder', slug: 'base64-encoder', description: 'Encode text to Base64 or decode it back', icon: '🔤' },
  { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Generate QR codes for URLs, text, or any content', icon: '📱' },
  { name: 'Image Compressor', slug: 'image-compressor', description: 'Compress images in browser — private, no upload', icon: '🖼️' },
  { name: 'PDF Merge & Split', slug: 'pdf-merge-split', description: 'Merge multiple PDFs or split a PDF into pages', icon: '📄' },
  { name: 'Text Diff Checker', slug: 'text-diff', description: 'Compare two texts side-by-side with differences highlighted', icon: '🔍' },
  { name: 'Color Palette & Contrast', slug: 'color-palette', description: 'Generate color palettes and check WCAG contrast ratios', icon: '🎨' },
  { name: 'Markdown to HTML', slug: 'markdown-html', description: 'Convert Markdown to HTML with live preview', icon: '📋' },
  { name: 'Time Zone Converter', slug: 'timezone-converter', description: 'Convert time between world time zones', icon: '🌍' },
];

const categories: Record<string, string[]> = {
  'Finance': ['emi-calculator', 'sip-calculator', 'income-tax-india', 'loan-affordability', 'compound-interest'],
  'Calculators': ['percentage-calculator', 'bmi-calculator', 'discount-calculator', 'tip-calculator'],
  'Date & Time': ['age-calculator', 'date-difference', 'timezone-converter'],
  'Education': ['gpa-calculator'],
  'Converters': ['unit-converter', 'base64-encoder'],
  'Text Tools': ['word-counter'],
  'Developer': ['json-formatter', 'text-diff', 'markdown-html'],
  'Security': ['password-generator'],
  'Media': ['image-compressor', 'qr-code-generator'],
  'Documents': ['pdf-merge-split'],
  'Design': ['color-palette'],
};

const toolListSchema = TOOL_ITEMS.map((tool, i) => ({
  '@type': 'ListItem',
  position: i + 1,
  name: tool.name,
  url: `https://bloghar.com/tools/${tool.slug}`,
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
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">24 free online tools — no registration required, everything runs in your browser.</p>
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
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="card p-5 group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <div>
                    <h3 className="font-medium group-hover:text-primary-600 transition-colors">{tool.icon} {tool.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <JsonLd type="ItemList" data={{
        name: 'Blog-Ghar Free Online Tools',
        description: '24 free online tools including calculators, converters, generators, and text utilities.',
        url: 'https://bloghar.com/tools',
        numberOfItems: TOOL_ITEMS.length,
        itemListElement: toolListSchema,
      }} />
    </div>
  );
}
