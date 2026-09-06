'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useParams } from 'next/navigation';
import { AdSlot } from '@/components/ads/ad-slot';

// ──────────────────────────────────────────────
//  TOOL DEFINITIONS
// ──────────────────────────────────────────────
type ToolDef = {
  name: string;
  icon: string;
  desc: string;
  component: string;
  howToSteps: { name: string; text: string }[];
  faqs: { question: string; answer: string }[];
};

const TOOLS: Record<string, ToolDef> = {
  'emi-calculator': {
    name: 'EMI Calculator', icon: '\u{1F3E6}', desc: 'Calculate your loan EMI for home, car, or personal loans. Get monthly EMI, total interest, and full amortization schedule.',
    component: 'emi',
    howToSteps: [
      { name: 'Enter Loan Details', text: 'Input loan amount, interest rate, and tenure in years.' },
      { name: 'View Breakdown', text: 'See monthly EMI, total interest, total payment, and year-by-year amortization table.' },
    ],
    faqs: [
      { question: 'What is EMI?', answer: 'EMI (Equated Monthly Installment) is the fixed monthly payment made to repay a loan over a specified period.' },
      { question: 'How is EMI calculated?', answer: 'EMI = P × R × (1+R)^N / ((1+R)^N - 1), where P is principal, R is monthly interest rate, and N is total months.' },
    ],
  },
  'sip-calculator': {
    name: 'SIP Calculator', icon: '\u{1F4C8}', desc: 'Calculate returns on your Systematic Investment Plan (SIP). See how your monthly investments grow with compound interest.',
    component: 'sip',
    howToSteps: [
      { name: 'Enter SIP Amount', text: 'Input your monthly investment amount in INR.' },
      { name: 'Set Rate & Duration', text: 'Enter expected annual return rate and investment period in years.' },
      { name: 'View Returns', text: 'See total invested, estimated returns, and total value with a growth table.' },
    ],
    faqs: [
      { question: 'What is SIP?', answer: 'SIP (Systematic Investment Plan) is a way to invest in mutual funds by contributing a fixed amount regularly (usually monthly).' },
    ],
  },
  'income-tax-india': {
    name: 'Income Tax Calculator (India)', icon: '\u{1F1EE}\u{1F1F3}', desc: 'Calculate income tax under both Old and New tax regimes. Supports HRA, 80C, 80D, and other deductions.',
    component: 'tax',
    howToSteps: [
      { name: 'Enter Income', text: 'Input your annual salary and other income.' },
      { name: 'Add Deductions', text: 'Enter HRA, 80C, 80D, home loan interest, and other deductions.' },
      { name: 'Compare Regimes', text: 'See tax under both Old and New regimes side by side.' },
    ],
    faqs: [
      { question: 'Which regime should I choose?', answer: 'The New regime is simpler with lower rates but fewer deductions. The Old regime has more deductions but higher rates. Use this calculator to compare both.' },
    ],
  },
  'loan-affordability': {
    name: 'Loan Affordability Calculator', icon: '\u{1F3E0}', desc: 'Find out how much home or car loan you can actually afford based on your income, expenses, and existing EMIs.',
    component: 'affordability',
    howToSteps: [
      { name: 'Enter Income', text: 'Input your monthly take-home salary.' },
      { name: 'Enter Expenses', text: 'Add your monthly expenses and existing EMIs.' },
      { name: 'Set Rate & Tenure', text: 'Choose the interest rate and loan tenure.' },
      { name: 'View Affordability', text: 'See the maximum loan amount you can safely take.' },
    ],
    faqs: [
      { question: 'How much EMI can I afford?', answer: 'Financial advisors recommend keeping total EMIs under 40-50% of your monthly take-home salary.' },
    ],
  },
  'percentage-calculator': {
    name: 'Percentage Calculator', icon: '%', desc: 'Calculate percentages, percentage change, percentage difference, and more. Multiple calculation modes in one tool.',
    component: 'percentage',
    howToSteps: [
      { name: 'Choose Mode', text: 'Select X% of Y, percentage change, percentage difference, or what percentage X is of Y.' },
      { name: 'Enter Values', text: 'Input the required numbers.' },
      { name: 'View Result', text: 'The result is calculated instantly.' },
    ],
    faqs: [
      { question: 'How do you calculate X% of Y?', answer: 'Formula: (X / 100) × Y. For example, 15% of 200 = (15 / 100) × 200 = 30.' },
    ],
  },
  'bmi-calculator': {
    name: 'BMI Calculator', icon: '⚖️', desc: 'Calculate your Body Mass Index. Check if you are underweight, normal, overweight, or obese. Includes ideal weight range.',
    component: 'bmi',
    howToSteps: [
      { name: 'Enter Height', text: 'Input your height in centimeters.' },
      { name: 'Enter Weight', text: 'Input your weight in kilograms.' },
      { name: 'View Result', text: 'Your BMI score, category, and ideal weight range are shown.' },
    ],
    faqs: [
      { question: 'What is BMI?', answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. Formula: weight (kg) / height (m)².' },
      { question: 'What is a healthy BMI?', answer: 'A healthy BMI is between 18.5 and 24.9. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese.' },
    ],
  },
  'age-calculator': {
    name: 'Age Calculator', icon: '\u{1F382}', desc: 'Calculate exact age from date of birth. Get years, months, days, and total days lived.',
    component: 'age',
    howToSteps: [
      { name: 'Enter Date of Birth', text: 'Select your birth date using the date picker.' },
      { name: 'View Result', text: 'Your exact age in years, months, days, and total days lived will be displayed.' },
    ],
    faqs: [
      { question: 'Does this account for leap years?', answer: 'Yes, the calculation accounts for leap years when computing total days.' },
    ],
  },
  'date-difference': {
    name: 'Date Difference Calculator', icon: '\u{1F4C5}', desc: 'Calculate days, weeks, months between two dates. Perfect for project timelines and event planning.',
    component: 'date',
    howToSteps: [
      { name: 'Select Dates', text: 'Choose two dates from the date pickers.' },
      { name: 'View Breakdown', text: 'See days, weeks, months, and years between the dates.' },
    ],
    faqs: [
      { question: 'Does this include leap years?', answer: 'Yes, the calculation accounts for leap years automatically.' },
    ],
  },
  'gpa-calculator': {
    name: 'GPA Calculator', icon: '\u{1F393}', desc: 'Calculate your Grade Point Average from course grades and credit hours. Add unlimited courses.',
    component: 'gpa',
    howToSteps: [
      { name: 'Add Courses', text: 'Enter course names, select grades, and set credit hours.' },
      { name: 'Calculate', text: 'Your GPA is automatically calculated with total credits.' },
    ],
    faqs: [
      { question: 'How is GPA calculated?', answer: 'GPA = Total Grade Points (grade × credit hours) ÷ Total Credit Hours.' },
    ],
  },
  'compound-interest': {
    name: 'Compound Interest Calculator', icon: '\u{1F4B0}', desc: 'Calculate compound interest on your investments or savings. See year-by-year growth with different compounding frequencies.',
    component: 'compound',
    howToSteps: [
      { name: 'Enter Principal', text: 'Input your initial investment or savings amount.' },
      { name: 'Set Rate & Time', text: 'Set the annual interest rate and time period in years.' },
      { name: 'View Growth', text: 'See total amount, interest earned, and year-by-year growth breakdown.' },
    ],
    faqs: [
      { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on the initial principal and also on accumulated interest from previous periods, making money grow faster over time.' },
    ],
  },
  'discount-calculator': {
    name: 'Discount Calculator', icon: '\u{1F3EC}', desc: 'Calculate discounted prices, savings amount, and final price after discount.',
    component: 'discount',
    howToSteps: [
      { name: 'Enter Price', text: 'Input the original price of the item.' },
      { name: 'Set Discount', text: 'Enter the discount percentage.' },
      { name: 'View Savings', text: 'See how much you save and the final price.' },
    ],
    faqs: [
      { question: 'How do I calculate discount?', answer: 'Discount = Original Price × Discount % / 100. Final Price = Original Price - Discount.' },
    ],
  },
  'tip-calculator': {
    name: 'Tip Calculator', icon: '\u{1F4B5}', desc: 'Calculate tip amount and split the bill among friends. Choose from common tip percentages.',
    component: 'tip',
    howToSteps: [
      { name: 'Enter Bill', text: 'Input the total bill amount.' },
      { name: 'Set Tip %', text: 'Use the slider or buttons to set tip percentage.' },
      { name: 'View Split', text: 'See tip amount, total bill, and per-person cost.' },
    ],
    faqs: [
      { question: 'How is tip calculated?', answer: 'Tip = Bill × Tip Percentage / 100. Per Person = (Bill + Tip) ÷ Number of People.' },
    ],
  },
  'unit-converter': {
    name: 'Multi-Unit Converter', icon: '\u{1F4CF}', desc: 'Convert between units of length, weight, temperature, speed, area, volume, and data storage all in one tool.',
    component: 'unit',
    howToSteps: [
      { name: 'Choose Category', text: 'Select the type of unit you want to convert (length, weight, temperature, etc.).' },
      { name: 'Enter Value', text: 'Input the value you want to convert.' },
      { name: 'Select Units', text: 'Choose source and target units.' },
      { name: 'View Result', text: 'Get the converted value instantly.' },
    ],
    faqs: [
      { question: 'What categories are supported?', answer: 'Length, weight, temperature, speed, area, volume, and data storage.' },
    ],
  },
  'word-counter': {
    name: 'Word Counter & Text Analyzer', icon: '\u{1F4DD}', desc: 'Count words, characters, sentences, paragraphs, and reading time. Perfect for essays, social media posts, and SEO.',
    component: 'wordcount',
    howToSteps: [
      { name: 'Type or Paste', text: 'Enter your text in the textarea.' },
      { name: 'View Stats', text: 'Real-time word count, character count, sentences, paragraphs, and reading time.' },
    ],
    faqs: [
      { question: 'Is my text saved?', answer: 'No, your text is not saved. Everything happens locally in your browser.' },
    ],
  },
  'json-formatter': {
    name: 'JSON Formatter & Validator', icon: '{ }', desc: 'Format, validate, and minify JSON data. Fix syntax errors instantly.',
    component: 'json',
    howToSteps: [
      { name: 'Paste JSON', text: 'Paste your raw JSON data in the input area.' },
      { name: 'Format or Minify', text: 'Click Format to prettify or Minify to compress.' },
      { name: 'Copy Result', text: 'Copy the output. Errors are shown if present.' },
    ],
    faqs: [
      { question: 'Does it validate JSON?', answer: 'Yes, it validates and shows any syntax errors in your JSON.' },
    ],
  },
  'password-generator': {
    name: 'Password Generator', icon: '\u{1F510}', desc: 'Generate strong, secure passwords with customizable length and character types. Includes strength indicator.',
    component: 'password',
    howToSteps: [
      { name: 'Set Options', text: 'Choose length and character types (uppercase, lowercase, numbers, symbols).' },
      { name: 'Generate', text: 'Click generate to create a secure password.' },
      { name: 'Copy', text: 'Click copy to use the password.' },
    ],
    faqs: [
      { question: 'How secure is the generated password?', answer: 'Passwords are generated using crypto-secure random selection with configurable complexity options.' },
    ],
  },
  'base64-encoder': {
    name: 'Base64 Encoder/Decoder', icon: '\u{1F524}', desc: 'Encode text to Base64 or decode Base64 back to plain text. Supports Unicode characters.',
    component: 'base64',
    howToSteps: [
      { name: 'Enter Text', text: 'Type or paste the text you want to encode or decode.' },
      { name: 'Choose Mode', text: 'Select Encode or Decode mode.' },
      { name: 'View Result', text: 'The result appears instantly.' },
    ],
    faqs: [
      { question: 'What is Base64?', answer: 'Base64 is an encoding scheme that represents binary data in ASCII string format using 64 characters.' },
    ],
  },
  'qr-code-generator': {
    name: 'QR Code Generator', icon: '\u{1F4F1}', desc: 'Generate custom QR codes for URLs, text, or any content. Download as PNG.',
    component: 'qr',
    howToSteps: [
      { name: 'Enter Content', text: 'Type or paste the URL or text you want to encode.' },
      { name: 'Adjust Size', text: 'Use the slider to set QR code size.' },
      { name: 'Download', text: 'Click download to save the QR code as PNG.' },
    ],
    faqs: [
      { question: 'What can QR codes contain?', answer: 'QR codes can contain URLs, plain text, contact info, WiFi credentials, and more.' },
    ],
  },
  'image-compressor': {
    name: 'Image Compressor', icon: '🖼', desc: 'Compress images in your browser. Reduce file size while controlling quality. Your photos never leave your device.',
    component: 'compress',
    howToSteps: [
      { name: 'Upload Image', text: 'Select an image file (JPG, PNG, WebP).' },
      { name: 'Adjust Quality', text: 'Use the slider to set compression quality.' },
      { name: 'Download', text: 'Download the compressed image and compare file sizes.' },
    ],
    faqs: [
      { question: 'Is my image uploaded?', answer: 'No. All compression happens in your browser using the Canvas API. Your images never leave your device.' },
    ],
  },
  'pdf-merge-split': {
    name: 'PDF Merge & Split', icon: '\u{1F4C4}', desc: 'Merge multiple PDFs into one file, or split a PDF into separate pages. All processing in your browser.',
    component: 'pdf',
    howToSteps: [
      { name: 'Choose Mode', text: 'Select Merge to combine PDFs or Split to extract pages.' },
      { name: 'Upload Files', text: 'Upload the PDF files you want to process.' },
      { name: 'Download', text: 'Download the merged PDF or extracted pages.' },
    ],
    faqs: [
      { question: 'Are my PDFs uploaded?', answer: 'No. PDF processing happens entirely in your browser using pdf-lib. Your documents never leave your device.' },
    ],
  },
  'text-diff': {
    name: 'Text Diff Checker', icon: '\u{1F50D}', desc: 'Compare two texts side-by-side and highlight the differences. Perfect for comparing code, documents, or drafts.',
    component: 'diff',
    howToSteps: [
      { name: 'Paste Original', text: 'Paste the original text in the left panel.' },
      { name: 'Paste Modified', text: 'Paste the modified text in the right panel.' },
      { name: 'View Differences', text: 'Added lines in green, removed in red, unchanged in normal text.' },
    ],
    faqs: [
      { question: 'Does this work with code?', answer: 'Yes, it works with any text including code, prose, JSON, and more.' },
    ],
  },
  'color-palette': {
    name: 'Color Palette & Contrast', icon: '\u{1F3A8}', desc: 'Generate beautiful color palettes and check WCAG contrast ratios for accessibility compliance.',
    component: 'color',
    howToSteps: [
      { name: 'Generate Palette', text: 'Click generate to create a new harmonious color palette.' },
      { name: 'Copy Colors', text: 'Click any color to copy its hex code.' },
      { name: 'Check Contrast', text: 'Use the contrast checker to verify WCAG accessibility compliance.' },
    ],
    faqs: [
      { question: 'What is WCAG contrast?', answer: 'WCAG requires minimum contrast ratios of 4.5:1 for normal text and 3:1 for large text between text and background colors.' },
    ],
  },
  'markdown-html': {
    name: 'Markdown to HTML Converter', icon: '\u{1F4CB}', desc: 'Convert Markdown to HTML in real-time. Supports headings, bold, italic, lists, tables, code blocks, and more.',
    component: 'markdown',
    howToSteps: [
      { name: 'Write Markdown', text: 'Type or paste Markdown content in the editor.' },
      { name: 'View Preview', text: 'See the rendered HTML output in real-time.' },
      { name: 'Copy HTML', text: 'Copy the generated HTML code.' },
    ],
    faqs: [
      { question: 'What Markdown syntax is supported?', answer: 'Headings (#, ##, ###), bold (**), italic (*), strikethrough (~~), links, images, lists, code blocks, blockquotes, tables, and horizontal rules.' },
    ],
  },
  'timezone-converter': {
    name: 'Time Zone Converter', icon: '\u{1F30D}', desc: 'Convert date and time between different time zones. See multiple world clocks simultaneously.',
    component: 'timezone',
    howToSteps: [
      { name: 'Select Time', text: 'Choose your date and time.' },
      { name: 'Choose Zone', text: 'Select the target time zone.' },
      { name: 'View Conversion', text: 'See the converted time instantly, plus comparison with other major cities.' },
    ],
    faqs: [
      { question: 'How many time zones are supported?', answer: 'All major time zones worldwide: IST, PST, EST, GMT, CET, JST, AEST, and more.' },
    ],
  },
};

// ──────────────────────────────────────────────
//  SHARED UI
// ──────────────────────────────────────────────
function ToolCard({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto px-4 py-6 ${wide ?? false ? 'max-w-5xl' : 'max-w-3xl'}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2 text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400">Free online tool — no registration, no uploads, runs entirely in your browser.</p>
      </div>
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 md:p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function ResultBox({ label, value, sub, highlight }: { label: string; value: string | number; sub?: string; highlight?: boolean }) {
  return (
    <div className={`p-5 rounded-xl text-center ${highlight ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-dark-bg'}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${highlight ? 'text-primary-600' : 'text-gray-900 dark:text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function LabelInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">{label}</label>
      <input {...props} className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
    </div>
  );
}

function LabelSelect({ label, children, ...props }: { label: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">{label}</label>
      <select {...props} className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        {children}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', className = '', ...props }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger'; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'px-5 py-2.5 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
    secondary: 'bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────
//  EMI CALCULATOR
// ──────────────────────────────────────────────
function EMICalc() {
  const [p, setP] = useState;
  const [r, setR] = useState(8.5);
  const [t, setT] = useState(20);
  const emi = useMemo(() => {
    const n = t * 12;
    const ri = r / 12 / 100;
    if (ri === 0) return +(p / n).toFixed(2);
    return +(p * ri * Math.pow(1 + ri, n) / (Math.pow(1 + ri, n) - 1)).toFixed(2);
  }, [p, r, t]);
  const total = useMemo(() => +(emi * t * 12).toFixed(2), [emi, t]);
  const interest = useMemo(() => +(total - p).toFixed(2), [total, p]);
  const schedule = useMemo(() => {
    const rows: { year: number; principal: number; interest: number; balance: number }[] = [];
    let bal = p;
    const n = t * 12;
    const ri = r / 12 / 100;
    for (let yr = 1; yr <= t; yr++) {
      let yrPrincipal = 0;
      let yrInterest = 0;
      for (let m = 0; m < 12 && bal > 0; m++) {
        const int = bal * ri;
        const princ = emi - int;
        yrInterest += int;
        yrPrincipal += princ;
        bal = Math.max(0, bal - princ);
      }
      rows.push({ year: yr, principal: +yrPrincipal.toFixed(0), interest: +yrInterest.toFixed(0), balance: +bal.toFixed(0) });
    }
    return rows;
  }, [p, r, t, emi]);

  return (
    <ToolCard title="\u{1F3E6} EMI Calculator" wide>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <LabelInput label="Loan Amount (₹)" type="number" value={p} onChange={(e) => setP(+e.target.value)} min={1000} step={10000} />
          <LabelInput label="Interest Rate (% per year)" type="number" value={r} onChange={(e) => setR(+e.target.value)} min={0.1} step={0.1} />
          <LabelInput label="Tenure (years)" type="number" value={t} onChange={(e) => setT(+e.target.value)} min={1} max={30} />
        </div>
        <div className="space-y-3">
          <ResultBox label="Monthly EMI" value={"₹" + emi.toLocaleString()} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Total Interest" value={"₹" + interest.toLocaleString()} />
            <ResultBox label="Total Payment" value={"₹" + total.toLocaleString()} />
          </div>
          <div className="mt-2 h-4 rounded-full bg-gray-100 dark:bg-dark-bg overflow-hidden flex">
            <div className="bg-primary-600 h-full transition-all" style={{ width: total > 0 ? `${(p / total) * 100}%` : '50%' }} title="Principal" />
            <div className="bg-yellow-400 h-full transition-all" style={{ width: total > 0 ? `${(interest / total) * 100}%` : '50%' }} title="Interest" />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Principal: ₹{p.toLocaleString()}</span>
            <span>Interest: ₹{interest.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-dark-border pt-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Amortization Schedule</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-border">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 dark:bg-dark-bg">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Year</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Principal (₹)</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Interest (₹)</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Balance (₹)</th>
            </tr></thead>
            <tbody>{schedule.map((row) => (
              <tr key={row.year} className="border-t border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{row.year}</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">{row.principal.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">{row.interest.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">{row.balance.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  SIP CALCULATOR
// ──────────────────────────────────────────────
function SIPCalc() {
  const [monthly, setMonthly] = useState;
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const result = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    const totalInvested = monthly * n;
    const maturity = +(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)).toFixed(0);
    const returns = +(maturity - totalInvested).toFixed(0);
    const growthTable: { year: number; invested: number; value: number; returns: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      const inv = monthly * months;
      const val = +(monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)).toFixed(0);
      growthTable.push({ year: y, invested: inv, value: val, returns: +(val - inv).toFixed(0) });
    }
    return { totalInvested, maturity, returns, growthTable };
  }, [monthly, rate, years]);

  return (
    <ToolCard title="\u{1F4C8} SIP Calculator" wide>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <LabelInput label="Monthly Investment (₹)" type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} min={500} step={500} />
          <LabelInput label="Expected Annual Return (%)" type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={1} max={30} step={0.5} />
          <LabelInput label="Investment Period (years)" type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={40} />
        </div>
        <div className="space-y-3">
          <ResultBox label="Total Invested" value={"₹" + result.totalInvested.toLocaleString()} />
          <ResultBox label="Estimated Returns" value={"₹" + result.returns.toLocaleString()} sub="Wealth gained" highlight />
          <ResultBox label="Maturity Value" value={"₹" + result.maturity.toLocaleString()} sub="Total value of your investment" />
          <div className="h-4 rounded-full bg-gray-100 dark:bg-dark-bg overflow-hidden flex">
            <div className="bg-primary-600 h-full transition-all" style={{ width: result.maturity > 0 ? `${(result.totalInvested / result.maturity) * 100}%` : '50%' }} title="Invested" />
            <div className="bg-green-500 h-full transition-all" style={{ width: result.maturity > 0 ? `${(result.returns / result.maturity) * 100}%` : '50%' }} title="Returns" />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Invested: ₹{result.totalInvested.toLocaleString()}</span>
            <span>Returns: ₹{result.returns.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-dark-border pt-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Year-by-Year Growth</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-border">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 dark:bg-dark-bg">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Year</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Invested (₹)</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Returns (₹)</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Value (₹)</th>
            </tr></thead>
            <tbody>{result.growthTable.map((row) => (
              <tr key={row.year} className="border-t border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{row.year}</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">{row.invested.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-green-600">{row.returns.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300 font-medium">{row.value.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  INCOME TAX CALCULATOR (INDIA)
// ──────────────────────────────────────────────
function TaxCalc() {
  const [salary, setSalary] = useState;
  const [hra, setHra] = useState;
  const [deduction80c, set80c] = useState;
  const [deduction80d, set80d] = useState;
  const [homeLoan, setHomeLoan] = useState(0);
  const [otherDeductions, setOther] = useState(0);
  const [standardDeduction, setStd] = useState;

  const oldRegime = useMemo(() => {
    const gross = salary;
    const ded = standardDeduction + hra + Math.min(deduction80c, 150000) + deduction80d + homeLoan + otherDeductions;
    const taxable = Math.max(0, gross - ded);
    let tax = 0;
    if (taxable > 1000000) tax += (taxable - 1000000) * 0.3 + 45000 + 12500 + 112500;
    else if (taxable > 500000) tax += (taxable - 500000) * 0.2 + 12500 + 112500;
    else if (taxable > 250000) tax += (taxable - 250000) * 0.1 + 112500;
    else if (taxable > 200000) tax += (taxable - 200000) * 0.05;
    else if (taxable > 50000) tax += (taxable - 50000) * 0.05;
    tax = Math.round(tax);
    const cess = Math.round(tax * 0.04);
    return { taxable, tax, cess, total: tax + cess, deductions: ded };
  }, [salary, hra, deduction80c, deduction80d, homeLoan, otherDeductions, standardDeduction]);

  const newRegime = useMemo(() => {
    const gross = salary;
    const taxable = Math.max(0, gross - 75000);
    let tax = 0;
    if (taxable > 1500000) tax += (taxable - 1500000) * 0.30 + 250000 + 125000 + 37500;
    else if (taxable > 1200000) tax += (taxable - 1200000) * 0.20 + 125000 + 37500;
    else if (taxable > 900000) tax += (taxable - 900000) * 0.15 + 37500;
    else if (taxable > 600000) tax += (taxable - 600000) * 0.10;
    else if (taxable > 300000) tax += (taxable - 300000) * 0.05;
    tax = Math.round(tax);
    const cess = Math.round(tax * 0.04);
    return { taxable, tax, cess, total: tax + cess, deductions: 75000 };
  }, [salary]);

  const recommended = oldRegime.total <= newRegime.total ? 'Old Regime' : 'New Regime';
  const savings = Math.abs(oldRegime.total - newRegime.total);

  return (
    <ToolCard title="\u{1F1EE}\u{1F1F3} Income Tax Calculator (India)" wide>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>FY 2025-26 (AY 2026-27)</strong> — Enter your annual salary and deductions to compare Old vs New tax regimes.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs flex items-center justify-center font-bold">1</span>
            Income Details
          </h3>
          <LabelInput label="Annual Salary (₹)" type="number" value={salary} onChange={(e) => setSalary(+e.target.value)} min={0} step={10000} />
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 pt-2">
            <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs flex items-center justify-center font-bold">2</span>
            Deductions (Old Regime Only)
          </h3>
          <LabelInput label="Standard Deduction (₹)" type="number" value={standardDeduction} onChange={(e) => setStd(+e.target.value)} />
          <LabelInput label="HRA (₹)" type="number" value={hra} onChange={(e) => setHra(+e.target.value)} min={0} />
          <LabelInput label="80C Investments (₹)" type="number" value={deduction80c} onChange={(e) => set80c(+e.target.value)} min={0} max={150000} />
          <div className="text-xs text-gray-500">Max: ₹1,50,000</div>
          <LabelInput label="80D Health Insurance (₹)" type="number" value={deduction80d} onChange={(e) => set80d(+e.target.value)} min={0} />
          <LabelInput label="Home Loan Interest (₹)" type="number" value={homeLoan} onChange={(e) => setHomeLoan(+e.target.value)} min={0} />
          <LabelInput label="Other Deductions (₹)" type="number" value={otherDeductions} onChange={(e) => setOther(+e.target.value)} min={0} />
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Results</h3>
          <div className={`p-5 rounded-xl text-center ${recommended === 'Old Regime' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700' : 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700'}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Recommended</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{recommended}</p>
            <p className="text-sm text-gray-500 mt-1">Save ₹{savings.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Old Regime</p>
            <div className="space-y-2 text-sm">
              {[
                ['Gross Salary', "₹" + salary.toLocaleString()],
                ['Total Deductions', "-₹" + oldRegime.deductions.toLocaleString()],
                ['Taxable Income', "₹" + oldRegime.taxable.toLocaleString()],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{l}</span><span className="text-gray-900 dark:text-white font-medium">{v}</span></div>
              ))}
              <hr className="border-gray-200 dark:border-dark-border" />
              {[
                ['Income Tax', "₹" + oldRegime.tax.toLocaleString()],
                ['Cess (4%)', "₹" + oldRegime.cess.toLocaleString()],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{l}</span><span className="text-gray-900 dark:text-white font-medium">{v}</span></div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-dark-border font-bold text-lg"><span>Total Tax</span><span className="text-red-600">₹{oldRegime.total.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">In-hand (approx)</span><span className="text-green-600 font-medium">₹{(salary - oldRegime.total).toLocaleString()}</span></div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">New Regime (Default)</p>
            <div className="space-y-2 text-sm">
              {[
                ['Gross Salary', "₹" + salary.toLocaleString()],
                ['Standard Deduction', "-₹" + newRegime.deductions.toLocaleString()],
                ['Taxable Income', "₹" + newRegime.taxable.toLocaleString()],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{l}</span><span className="text-gray-900 dark:text-white font-medium">{v}</span></div>
              ))}
              <hr className="border-gray-200 dark:border-dark-border" />
              {[
                ['Income Tax', "₹" + newRegime.tax.toLocaleString()],
                ['Cess (4%)', "₹" + newRegime.cess.toLocaleString()],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{l}</span><span className="text-gray-900 dark:text-white font-medium">{v}</span></div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-dark-border font-bold text-lg"><span>Total Tax</span><span className="text-red-600">₹{newRegime.total.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">In-hand (approx)</span><span className="text-green-600 font-medium">₹{(salary - newRegime.total).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  LOAN AFFORDABILITY CALCULATOR
// ──────────────────────────────────────────────
function AffordabilityCalc() {
  const [income, setIncome] = useState;
  const [expenses, setExpenses] = useState;
  const [existingEmi, setExistingEmi] = useState(0);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const maxEmi = useMemo(() => +(income * 0.40).toFixed(0), [income]);
  const availableEmi = useMemo(() => Math.max(0, maxEmi - existingEmi), [maxEmi, existingEmi]);

  const maxLoan = useMemo(() => {
    const n = tenure * 12;
    const ri = rate / 12 / 100;
    if (ri === 0) return availableEmi * n;
    return +(availableEmi * (Math.pow(1 + ri, n) - 1) / (ri * Math.pow(1 + ri, n))).toFixed(0);
  }, [availableEmi, rate, tenure]);

  const emiPct = income > 0 ? Math.round((availableEmi / income) * 100) : 0;

  return (
    <ToolCard title="\u{1F3E0} Loan Affordability Calculator" wide>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <LabelInput label="Monthly Take-Home Salary (₹)" type="number" value={income} onChange={(e) => setIncome(+e.target.value)} min={0} step={1000} />
          <LabelInput label="Monthly Expenses (₹)" type="number" value={expenses} onChange={(e) => setExpenses(+e.target.value)} min={0} step={1000} />
          <LabelInput label="Existing Monthly EMIs (₹)" type="number" value={existingEmi} onChange={(e) => setExistingEmi(+e.target.value)} min={0} />
          <LabelInput label="Interest Rate (% per year)" type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0.1} step={0.1} />
          <LabelInput label="Loan Tenure (years)" type="number" value={tenure} onChange={(e) => setTenure(+e.target.value)} min={1} max={30} />
        </div>
        <div className="space-y-4">
          <ResultBox label="Max EMI (40% of income)" value={"₹" + maxEmi.toLocaleString()} />
          <ResultBox label="Available for New Loan" value={"₹" + availableEmi.toLocaleString()} sub={`${emiPct}% of your income`} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Max Loan Amount" value={"₹" + maxLoan.toLocaleString()} />
            <ResultBox label="Recommended (80%)" value={"₹" + Math.round(maxLoan * 0.8).toLocaleString()} sub="Safe borrowing limit" />
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Tip:</strong> Financial advisors recommend keeping total EMIs under 40% of your monthly income for financial stability.
            </p>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  PERCENTAGE CALCULATOR
// ──────────────────────────────────────────────
function PercentageCalc() {
  const [mode, setMode] = useState<'of' | 'change' | 'diff' | 'iswhat'>('of');
  const [a, setA] = useState(15);
  const [b, setB] = useState(200);

  const results = useMemo(() => {
    if (mode === 'of') return { result: +((a / 100) * b).toFixed(2), label: `${a}% of ${b} =`, suffix: '' };
    if (mode === 'change') return { result: b > 0 ? +((a - b) / b * 100).toFixed(1) : 0, label: `Change from ${b} to ${a} =`, suffix: '%' };
    if (mode === 'diff') return { result: b > 0 ? +((a - b) / ((a + b) / 2) * 100).toFixed(1) : 0, label: `% difference between ${a} and ${b} =`, suffix: '%' };
    return { result: b > 0 ? +(a / b * 100).toFixed(2) : 0, label: `${a} is what % of ${b}?`, suffix: '%' };
  }, [mode, a, b]);

  return (
    <ToolCard title="% Percentage Calculator">
      <div className="flex flex-wrap gap-2 mb-6">
        {([['of', 'X% of Y'], ['change', '% Change'], ['diff', '% Difference'], ['iswhat', 'X is what % of Y']] as const).map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LabelInput label={mode === 'change' ? 'New Value' : mode === 'iswhat' ? 'Value' : 'Percentage (%)'} type="number" value={a} onChange={(e) => setA(+e.target.value)} />
        <LabelInput label={mode === 'change' ? 'Original Value' : mode === 'iswhat' ? 'Total Value' : 'Number'} type="number" value={b} onChange={(e) => setB(+e.target.value)} />
      </div>
      <div className="p-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
        <p className="text-sm text-gray-500 mb-2">{results.label}</p>
        <p className="text-5xl font-bold text-primary-600">{results.result}{results.suffix}</p>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  BMI CALCULATOR
// ──────────────────────────────────────────────
function BMICalc() {
  const [h, setH] = useState(170);
  const [w, setW] = useState(70);
  const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const idealLow = +(18.5 * Math.pow(h / 100, 2)).toFixed(1);
  const idealHigh = +(24.9 * Math.pow(h / 100, 2)).toFixed(1);

  return (
    <ToolCard title="⚖️ BMI Calculator">
      <div className="space-y-4 mb-6">
        <LabelInput label="Height (cm)" type="number" value={h} onChange={(e) => setH(+e.target.value)} min={50} max={300} />
        <LabelInput label="Weight (kg)" type="number" value={w} onChange={(e) => setW(+e.target.value)} min={2} max={500} />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ResultBox label="Your BMI" value={bmi} sub={cat} highlight />
        <ResultBox label="Ideal Weight Range" value={`${idealLow} – ${idealHigh} kg`} sub={`For your height of ${h}cm`} />
      </div>
      <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">BMI Categories</p>
        <div className="space-y-2">
          {[['< 18.5', 'Underweight', 'bg-blue-100 dark:bg-blue-900/30 text-blue-700'], ['18.5 – 24.9', 'Normal', 'bg-green-100 dark:bg-green-900/30 text-green-700'], ['25 – 29.9', 'Overweight', 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700'], ['≥ 30', 'Obese', 'bg-red-100 dark:bg-red-900/30 text-red-700']].map(([range, label, cls]) => (
            <div key={range} className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${cls}`}>
              <span className="font-medium">{range}</span>
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  AGE CALCULATOR
// ──────────────────────────────────────────────
function AgeCalc() {
  const [birth, setBirth] = useState('2000-01-01');
  const diff = useMemo(() => {
    const now = new Date();
    const b = new Date(birth);
    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();
    if (days < 0) { months--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }
    return { years, months, days, totalDays: Math.floor((now.getTime() - b.getTime()) / 86400000) };
  }, [birth]);

  return (
    <ToolCard title="\u{1F382} Age Calculator">
      <LabelInput label="Date of Birth" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <ResultBox label="Years" value={diff.years} />
        <ResultBox label="Months" value={diff.months} />
        <ResultBox label="Days" value={diff.days} />
        <ResultBox label="Total Days" value={diff.totalDays.toLocaleString()} highlight />
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  DATE DIFFERENCE
// ──────────────────────────────────────────────
function DateDiffCalc() {
  const [d1, setD1] = useState('2025-01-01');
  const [d2, setD2] = useState('2025-12-31');
  const diff = useMemo(() => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const ms = Math.abs(date2.getTime() - date1.getTime());
    const days = Math.floor(ms / 86400000);
    const weeks = Math.floor(days / 7);
    const months = (date2.getFullYear() - date1.getFullYear()) * 12 + date2.getMonth() - date1.getMonth();
    const adjustedMonths = date2.getDate() < date1.getDate() ? Math.abs(months - 1) : Math.abs(months);
    return { days, weeks, months: adjustedMonths };
  }, [d1, d2]);

  return (
    <ToolCard title="\u{1F4C5} Date Difference Calculator">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LabelInput label="From Date" type="date" value={d1} onChange={(e) => setD1(e.target.value)} />
        <LabelInput label="To Date" type="date" value={d2} onChange={(e) => setD2(e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ResultBox label="Days" value={diff.days.toLocaleString()} highlight />
        <ResultBox label="Weeks" value={diff.weeks.toLocaleString()} />
        <ResultBox label="Months" value={diff.months.toLocaleString()} />
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  GPA CALCULATOR
// ──────────────────────────────────────────────
function GPACalc() {
  const [courses, setCourses] = useState([{ name: 'Course 1', grade: 'A', credits: 4 }]);
  const gradePoints: Record<string, number> = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0 };
  const gpa = useMemo(() => {
    const total = courses.reduce((s, c) => s + (gradePoints[c.grade] || 0) * c.credits, 0);
    const creds = courses.reduce((s, c) => s + c.credits, 0);
    return creds ? (total / creds).toFixed(2) : '0.00';
  }, [courses]);

  const add = () => setCourses([...courses, { name: `Course ${courses.length + 1}`, grade: 'A', credits: 3 }]);
  const remove = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, value: string | number) => {
    const next = [...courses];
    (next[i] as any)[field] = value;
    setCourses(next);
  };

  return (
    <ToolCard title="\u{1F393} GPA Calculator">
      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide px-1">
          <span className="col-span-5">Course</span>
          <span className="col-span-3">Grade</span>
          <span className="col-span-2">Credits</span>
          <span className="col-span-2"></span>
        </div>
        {courses.map((c, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input value={c.name} onChange={(e) => update(i, 'name', e.target.value)} className="col-span-5 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm" />
            <select value={c.grade} onChange={(e) => update(i, 'grade', e.target.value)} className="col-span-3 px-2 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm">
              {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g} ({gradePoints[g]})</option>)}
            </select>
            <input type="number" value={c.credits} onChange={(e) => update(i, 'credits', +e.target.value)} min={0.5} max={10} step={0.5} className="col-span-2 px-2 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm" />
            <button onClick={() => remove(i)} className="col-span-2 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
          </div>
        ))}
      </div>
      <Btn onClick={add} variant="secondary" className="w-full mb-6">+ Add Course</Btn>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
        <p className="text-sm text-gray-500 mb-1">Your GPA</p>
        <p className="text-5xl font-bold text-primary-600">{gpa}</p>
        <p className="text-xs text-gray-400 mt-2">{courses.reduce((s, c) => s + c.credits, 0).toFixed(1)} total credits</p>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  COMPOUND INTEREST
// ──────────────────────────────────────────────
function CompoundCalc() {
  const [p, setP] = useState;
  const [r, setR] = useState(8);
  const [t, setT] = useState(10);
  const [n, setN] = useState(12);
  const result = useMemo(() => {
    const amt = +(p * Math.pow(1 + r / 100 / n, n * t)).toFixed(2);
    const ci = +(amt - p).toFixed(2);
    const growth: { year: number; value: number; interest: number }[] = [];
    for (let y = 1; y <= t; y++) {
      const val = +(p * Math.pow(1 + r / 100 / n, n * y)).toFixed(0);
      growth.push({ year: y, value: val, interest: +(val - p).toFixed(0) });
    }
    return { amt, ci, growth };
  }, [p, r, t, n]);

  return (
    <ToolCard title="\u{1F4B0} Compound Interest Calculator" wide>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <LabelInput label="Principal Amount (₹)" type="number" value={p} onChange={(e) => setP(+e.target.value)} min={1} step={1000} />
          <LabelInput label="Annual Interest Rate (%)" type="number" value={r} onChange={(e) => setR(+e.target.value)} min={0.1} step={0.1} />
          <LabelInput label="Time Period (years)" type="number" value={t} onChange={(e) => setT(+e.target.value)} min={1} max={50} />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Compounding Frequency</label>
            <select value={n} onChange={(e) => setN(+e.target.value)} className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg text-gray-900 dark:text-white">
              <option value={1}>Annually</option>
              <option value={2}>Semi-annually</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          <ResultBox label="Total Amount" value={"₹" + result.amt.toLocaleString()} highlight />
          <div className="grid grid-cols-2 gap-3">
            <ResultBox label="Principal" value={"₹" + p.toLocaleString()} />
            <ResultBox label="Interest Earned" value={"₹" + result.ci.toLocaleString()} sub="Wealth gained" />
          </div>
          <div className="h-4 rounded-full bg-gray-100 dark:bg-dark-bg overflow-hidden flex">
            <div className="bg-primary-600 h-full transition-all" style={{ width: result.amt > 0 ? `${(p / result.amt) * 100}%` : '50%' }} />
            <div className="bg-green-500 h-full transition-all" style={{ width: result.amt > 0 ? `${(result.ci / result.amt) * 100}%` : '50%' }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500"><span>Principal</span><span>Interest</span></div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-dark-border pt-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Year-by-Year Growth</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-border">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 dark:bg-dark-bg">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Year</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Value (₹)</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Interest (₹)</th>
            </tr></thead>
            <tbody>{result.growth.map((row) => (
              <tr key={row.year} className="border-t border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{row.year}</td>
                <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300 font-medium">{row.value.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-green-600">{row.interest.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  DISCOUNT CALCULATOR
// ──────────────────────────────────────────────
function DiscountCalc() {
  const [price, setPrice] = useState;
  const [discount, setDiscount] = useState(25);
  const saved = +(price * discount / 100).toFixed(2);
  const final = +(price - saved).toFixed(2);

  return (
    <ToolCard title="\u{1F3EC} Discount Calculator">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LabelInput label="Original Price (₹)" type="number" value={price} onChange={(e) => setPrice(+e.target.value)} min={0} step={1} />
        <LabelInput label="Discount (%)" type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)} min={0} max={100} step={1} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ResultBox label="Original Price" value={"₹" + price.toLocaleString()} />
        <ResultBox label="You Save" value={"₹" + saved.toLocaleString()} sub={`${discount}% off`} highlight />
        <ResultBox label="Final Price" value={"₹" + final.toLocaleString()} />
      </div>
      <div className="mt-4">
        <input type="range" min={0} max={100} value={discount} onChange={(e) => setDiscount(+e.target.value)} className="w-full accent-primary-600" />
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  TIP CALCULATOR
// ──────────────────────────────────────────────
function TipCalc() {
  const [bill, setBill] = useState;
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState(2);
  const tipAmt = +(bill * tip / 100).toFixed(2);
  const total = +(bill + tipAmt).toFixed(2);
  const perPerson = people > 0 ? +(total / people).toFixed(2) : 0;

  return (
    <ToolCard title="\u{1F4B5} Tip Calculator">
      <div className="space-y-4 mb-6">
        <LabelInput label="Bill Amount (₹)" type="number" value={bill} onChange={(e) => setBill(+e.target.value)} min={0} step={1} />
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Tip Percentage: {tip}%</label>
          <input type="range" min={0} max={50} value={tip} onChange={(e) => setTip(+e.target.value)} className="w-full accent-primary-600" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {[5, 10, 15, 20, 25].map(t => (
              <button key={t} onClick={() => setTip(t)} className={`px-2 py-1 rounded ${tip === t ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>{t}%</button>
            ))}
          </div>
        </div>
        <LabelInput label="Number of People" type="number" value={people} onChange={(e) => setPeople(+e.target.value)} min={1} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ResultBox label="Tip Amount" value={"₹" + tipAmt} />
        <ResultBox label="Total Bill" value={"₹" + total} highlight />
        <ResultBox label="Per Person" value={"₹" + perPerson} sub={`${people} people`} />
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  MULTI-UNIT CONVERTER
// ──────────────────────────────────────────────
function UnitConv() {
  const [cat, setCat] = useState('length');
  const [val, setVal] = useState(1);
  const [from, setFrom] = useState('Meter');
  const [to, setTo] = useState('Kilometer');

  const categories: Record<string, { units: Record<string, number> }> = {
    length: { units: { 'Meter': 1, 'Kilometer': 0.001, 'Centimeter': 100, 'Millimeter': 1000, 'Inch': 39.37, 'Foot': 3.281, 'Yard': 1.094, 'Mile': 0.000621 } },
    weight: { units: { 'Kilogram': 1, 'Gram': 1000, 'Milligram': 1000000, 'Pound': 2.205, 'Ounce': 35.274, 'Ton': 0.001 } },
    temperature: { units: { 'Celsius': 1, 'Fahrenheit': 1, 'Kelvin': 1 } },
    speed: { units: { 'km/h': 1, 'm/s': 3.6, 'mph': 1.609, 'Knot': 1.852 } },
    area: { units: { 'sq m': 1, 'sq km': 0.000001, 'sq ft': 10.764, 'Acre': 0.000247, 'Hectare': 0.0001 } },
    volume: { units: { 'Liter': 1, 'Milliliter': 1000, 'Gallon (US)': 0.264, 'Cup': 4.227, 'Fluid oz': 33.814 } },
    data: { units: { 'Byte': 1, 'KB': 0.001, 'MB': 0.000001, 'GB': 0.000000001, 'TB': 0.000000000001 } },
  };
  const cfg = categories[cat];
  const unitKeys = Object.keys(cfg.units);

  useEffect(() => {
    if (!unitKeys.includes(from)) setFrom(unitKeys[0]);
    if (!unitKeys.includes(to)) setTo(unitKeys[1] || unitKeys[0]);
  }, [cat]);

  const result = useMemo(() => {
    if (cat === 'temperature') {
      let celsius: number;
      if (from === 'Fahrenheit') celsius = (val - 32) * 5 / 9;
      else if (from === 'Kelvin') celsius = val - 273.15;
      else celsius = val;
      if (to === 'Fahrenheit') return +(celsius * 9 / 5 + 32).toFixed(4);
      if (to === 'Kelvin') return +(celsius + 273.15).toFixed(4);
      return +celsius.toFixed(4);
    }
    return +((val / cfg.units[from]) * cfg.units[to]).toFixed(6);
  }, [val, from, to, cat]);

  const swap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  return (
    <ToolCard title="\u{1F4CF} Multi-Unit Converter" wide>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(categories).map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${cat === c ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6 items-end">
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">From</label>
          <input type="number" value={val} onChange={(e) => setVal(+e.target.value)} className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg mb-2" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg">
            {unitKeys.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="md:col-span-1 flex md:justify-center pb-2">
          <button onClick={swap} className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition-colors text-xl">⇔</button>
        </div>
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">To</label>
          <div className="px-3.5 py-2.5 border border-gray-200 dark:border-dark-border rounded-xl bg-gray-50 dark:bg-dark-bg mb-2 text-lg font-semibold text-primary-600 text-right">{result.toLocaleString()}</div>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg">
            {unitKeys.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl text-center">
        <p className="text-sm text-gray-500">{val} {from} = <strong className="text-primary-600">{result.toLocaleString()} {to}</strong></p>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  WORD COUNTER
// ──────────────────────────────────────────────
function WordCounter() {
  const [t, setT] = useState('');
  const stats = useMemo(() => {
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    const chars = t.length;
    const charsNoSpace = t.replace(/\s/g, '').length;
    const sentences = t.trim() ? t.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = t.split(/\n\n+/).filter(p => p.trim()).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readTime };
  }, [t]);

  return (
    <ToolCard title="\u{1F4DD} Word Counter & Text Analyzer" wide>
      <textarea value={t} onChange={(e) => setT(e.target.value)} placeholder="Type or paste your text here..." className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg resize-none text-base mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          ['Words', stats.words, 'text-primary-600'],
          ['Chars', stats.chars, 'text-blue-600'],
          ['No Spaces', stats.charsNoSpace, 'text-blue-600'],
          ['Sentences', stats.sentences, 'text-green-600'],
          ['Paragraphs', stats.paragraphs, 'text-yellow-600'],
          ['Read Time', `${stats.readTime} min`, 'text-orange-600'],
        ].map(([label, value, color]) => (
          <div key={label as string} className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  JSON FORMATTER
// ──────────────────────────────────────────────
function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) { setError(e.message); setOutput(''); }
  }, [input]);
  const minify = useCallback(() => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError('');
    } catch (e: any) { setError(e.message); setOutput(''); }
  }, [input]);

  return (
    <ToolCard title="{ } JSON Formatter & Validator" wide>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste your JSON here...' className="h-72 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <textarea readOnly value={output} placeholder="Formatted JSON will appear here..." className="h-72 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg bg-gray-50 dark:bg-dark-bg resize-none font-mono text-sm" />
      </div>
      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-3"><p className="text-red-600 text-sm font-mono">{error}</p></div>}
      <div className="flex gap-2">
        <Btn onClick={format}>Format</Btn>
        <Btn onClick={minify} variant="secondary">Minify</Btn>
        <Btn onClick={() => { setInput(''); setOutput(''); setError(''); }} variant="secondary">Clear</Btn>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  PASSWORD GENERATOR
// ──────────────────────────────────────────────
function PasswordGen() {
  const [len, setLen] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [pwd, setPwd] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = '';
    if (opts.upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.lower) pool += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.numbers) pool += '0123456789';
    if (opts.symbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let r = '';
    for (let i = 0; i < len; i++) r += pool[arr[i] % pool.length];
    setPwd(r);
  }, [len, opts]);

  useEffect(() => { generate(); }, [generate]);

  const strength = useMemo(() => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (opts.upper && /[A-Z]/.test(pwd)) score++;
    if (opts.lower && /[a-z]/.test(pwd)) score++;
    if (opts.numbers && /[0-9]/.test(pwd)) score++;
    if (opts.symbols && /[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  }, [pwd, opts]);

  const copy = () => { navigator.clipboard.writeText(pwd); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <ToolCard title="\u{1F510} Password Generator">
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Length: {len}</label>
          <input type="range" min={4} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full accent-primary-600" />
          <div className="flex justify-between text-xs text-gray-400"><span>4</span><span>64</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['upper', 'Uppercase (A-Z)'], ['lower', 'Lowercase (a-z)'], ['numbers', 'Numbers (0-9)'], ['symbols', 'Symbols (!@#)']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 p-3 border border-gray-200 dark:border-dark-border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
              <input type="checkbox" checked={(opts as any)[key]} onChange={(e) => setOpts({ ...opts, [key]: e.target.checked })} className="w-4 h-4 accent-primary-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
        <Btn onClick={generate} className="w-full">Generate Password</Btn>
      </div>
      {pwd && (
        <div>
          <div className="flex gap-2 mb-3">
            <input readOnly value={pwd} className="flex-1 px-4 py-3 bg-gray-100 dark:bg-dark-bg rounded-xl font-mono text-sm border border-gray-200 dark:border-dark-border" />
            <Btn onClick={copy}>{copied ? 'Copied!' : 'Copy'}</Btn>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 dark:bg-dark-bg rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} transition-all`} style={{ width: `${(strength.score / 7) * 100}%` }} />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{strength.label}</span>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  BASE64 ENCODER
// ──────────────────────────────────────────────
function Base64Encoder() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const result = useMemo(() => {
    try { return mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))); }
    catch { return 'Error: Invalid input'; }
  }, [input, mode]);

  return (
    <ToolCard title="\u{1F524} Base64 Encoder/Decoder" wide>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('encode')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'encode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400'}`}>Encode to Base64</button>
        <button onClick={() => setMode('decode')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'decode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-400'}`}>Decode from Base64</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." className="h-40 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg resize-none text-sm" />
        <textarea readOnly value={result} placeholder="Result..." className="h-40 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg bg-gray-50 dark:bg-dark-bg resize-none text-sm font-mono" />
      </div>
      {result !== 'Error: Invalid input' && <div className="text-right"><Btn onClick={() => navigator.clipboard.writeText(result)} variant="secondary">Copy Result</Btn></div>}
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  QR CODE GENERATOR
// ──────────────────────────────────────────────
function QRCodeGen() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const url = text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=1e293b&margin=10` : '';

  return (
    <ToolCard title="\u{1F4F1} QR Code Generator">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL, text, or any content..." className="w-full h-20 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg resize-none mb-4" />
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Size: {size}px × {size}px</label>
        <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-primary-600" />
      </div>
      {url && (
        <div className="text-center p-8 bg-gray-50 dark:bg-dark-bg rounded-xl">
          <img src={url} alt="QR Code" className="mx-auto mb-4 border border-gray-200 dark:border-dark-border rounded-lg" width={size} height={size} />
          <a href={url} download="qrcode.png" className="btn-primary inline-block">Download PNG</a>
        </div>
      )}
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  IMAGE COMPRESSOR
// ──────────────────────────────────────────────
function ImageCompressor() {
  const [preview, setPreview] = useState('');
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setOriginalSize(f.size);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const compress = () => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 2048;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else { w = Math.round(w * maxDim / h); h = maxDim; }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (blob) setResult({ blob, size: blob.size });
        }, 'image/jpeg', quality);
      }
    };
    img.src = preview;
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed-image.jpg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const saved = result ? Math.round((1 - result.size / originalSize) * 100) : 0;

  return (
    <ToolCard title="🖼 Image Compressor">
      <div className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl p-8 text-center mb-4">
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" id="img-upload" />
        <label htmlFor="img-upload" className="cursor-pointer block">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Click to upload an image</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — processed in browser, never uploaded</p>
        </label>
      </div>
      {preview && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Original — {(originalSize / 1024).toFixed(1)} KB</p>
              <img src={preview} alt="Original" className="w-full max-h-64 object-contain bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-200 dark:border-dark-border" />
            </div>
            {result && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Compressed — {(result.size / 1024).toFixed(1)} KB (saved {saved}%)</p>
                <img src={URL.createObjectURL(result.blob)} alt="Compressed" className="w-full max-h-64 object-contain bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-200 dark:border-dark-border" />
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Quality: {Math.round(quality * 100)}%</label>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-primary-600" />
          </div>
          <div className="flex gap-2">
            <Btn onClick={compress} className="flex-1">Compress Image</Btn>
            {result && <Btn onClick={download} className="flex-1">Download</Btn>}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  PDF MERGE & SPLIT
// ──────────────────────────────────────────────
function PDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [merged, setMerged] = useState<Blob | null>(null);
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [splitPages, setSplitPages] = useState('all');
  const [splitResult, setSplitResult] = useState<Blob | null>(null);

  const handleMergeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || []);
    setFiles(f);
    setMerged(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedDoc = await PDFDocument.create();
      for (const f of files) {
        const buf = await f.arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => mergedDoc.addPage(p));
      }
      const pdfBytes = await mergedDoc.save();
      setMerged(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch (e) { console.error('Merge error:', e); }
  };

  const handleSplitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setSingleFile(f); setSplitResult(null); }
  };

  const splitPDF = async () => {
    if (!singleFile) return;
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await singleFile.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const total = doc.getPageCount();
      const pagesToExtract: number[] = splitPages === 'all'
        ? Array.from({ length: total }, (_, i) => i)
        : splitPages.split(',').map(s => parseInt(s.trim()) - 1).filter(n => n >= 0 && n < total);

      if (pagesToExtract.length === 0) return;

      if (pagesToExtract.length === total) {
        const pdfBytes = await doc.save();
        setSplitResult(new Blob([pdfBytes], { type: 'application/pdf' }));
      } else {
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(doc, pagesToExtract);
        pages.forEach(p => newDoc.addPage(p));
        const pdfBytes = await newDoc.save();
        setSplitResult(new Blob([pdfBytes], { type: 'application/pdf' }));
      }
    } catch (e) { console.error('Split error:', e); }
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolCard title="\u{1F4C4} PDF Merge & Split" wide>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Merge PDFs</h3>
          <div className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl p-6 text-center mb-4">
            <input type="file" accept=".pdf" multiple onChange={handleMergeUpload} className="hidden" id="merge-upload" />
            <label htmlFor="merge-upload" className="cursor-pointer block">
              <p className="text-2xl mb-2">📁</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click to select PDF files</p>
            </label>
          </div>
          {files.length > 0 && (
            <div className="space-y-2 mb-4">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg text-sm">
                  <span className="truncate flex-1 text-gray-700 dark:text-gray-300">{i + 1}. {f.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{(f.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
          )}
          <Btn onClick={mergePDFs} disabled={files.length < 2} className="w-full">Merge {files.length} PDFs</Btn>
          {merged && <div className="mt-3"><Btn onClick={() => downloadBlob(merged, `merged-${files.length}-files.pdf`)} variant="secondary" className="w-full">Download Merged PDF</Btn></div>}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Split PDF</h3>
          <div className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl p-6 text-center mb-4">
            <input type="file" accept=".pdf" onChange={handleSplitUpload} className="hidden" id="split-upload" />
            <label htmlFor="split-upload" className="cursor-pointer block">
              <p className="text-2xl mb-2">📄</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click to select a PDF file</p>
            </label>
          </div>
          {singleFile && <p className="text-sm text-gray-500 mb-3">{singleFile.name}</p>}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Pages to extract (e.g., 1,3,5 or "all")</label>
            <input type="text" value={splitPages} onChange={(e) => setSplitPages(e.target.value)} placeholder="all" className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg text-sm" />
          </div>
          <Btn onClick={splitPDF} disabled={!singleFile} className="w-full">Extract Pages</Btn>
          {splitResult && <div className="mt-3"><Btn onClick={() => downloadBlob(splitResult, 'split-pages.pdf')} variant="secondary" className="w-full">Download Extracted PDF</Btn></div>}
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  TEXT DIFF CHECKER
// ──────────────────────────────────────────────
function TextDiff() {
  const [left, setLeft] = useState('The quick brown fox jumps over the lazy dog.\nBlog-Ghar is a great platform.\n\nFeatures:\n- Fast\n- Free\n- Easy to use');
  const [right, setRight] = useState('The quick brown fox jumps over the sleeping dog.\nBlog-Ghar is an amazing platform for everyone.\n\nFeatures:\n- Fast\n- Free\n- Easy to use\n- Open source');

  const linesL = left.split('\n');
  const linesR = right.split('\n');
  const maxLines = Math.max(linesL.length, linesR.length);
  const diffs: { left: string; right: string; type: 'same' | 'change' | 'add' | 'del' }[] = [];

  for (let i = 0; i < maxLines; i++) {
    const l = linesL[i] ?? '';
    const r = linesR[i] ?? '';
    if (l === r) diffs.push({ left: l, right: r, type: 'same' });
    else if (l && !r) diffs.push({ left: l, right: '', type: 'del' });
    else if (!l && r) diffs.push({ left: '', right: r, type: 'add' });
    else diffs.push({ left: l, right: r, type: 'change' });
  }

  return (
    <ToolCard title="\u{1F50D} Text Diff Checker" wide>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Original Text</label>
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg resize-none font-mono text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Modified Text</label>
          <textarea value={right} onChange={(e) => setRight(e.target.value)} className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg resize-none font-mono text-sm" />
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Comparison</h3>
      <div className="rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="grid grid-cols-2 bg-gray-50 dark:bg-dark-bg">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200 dark:border-dark-border">Original</div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-500">Modified</div>
        </div>
        {diffs.map((d, i) => {
          const bgL = d.type === 'del' ? 'bg-red-50 dark:bg-red-900/20' : d.type === 'change' ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'transparent';
          const bgR = d.type === 'add' ? 'bg-green-50 dark:bg-green-900/20' : d.type === 'change' ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'transparent';
          return (
            <div key={i} className="grid grid-cols-2 border-t border-gray-100 dark:border-dark-border text-sm">
              <div className={`px-3 py-1.5 font-mono ${bgL} ${d.type === 'del' ? 'line-through text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>{d.left || ' '}</div>
              <div className={`px-3 py-1.5 font-mono ${bgR} ${d.type === 'add' ? 'text-green-600' : d.type === 'change' ? 'text-yellow-700' : 'text-gray-700 dark:text-gray-300'}`}>{d.right || ' '}</div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded"></span> Removed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></span> Added</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/30 rounded"></span> Changed</span>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  COLOR PALETTE & CONTRAST
// ──────────────────────────────────────────────
function ColorTool() {
  const [palette, setPalette] = useState<string[]>([]);
  const [contrastBg, setContrastBg] = useState('#ffffff');
  const [contrastFg, setContrastFg] = useState('#1e293b');

  const generate = () => {
    const base = Math.floor(Math.random() * 360);
    setPalette(Array.from({ length: 5 }, (_, i) => {
      const h = (base + i * 35) % 360;
      return `hsl(${h}, 65%, ${45 + (i % 2) * 15}%)`;
    }));
  };

  const getLuminance = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0, 2), 16) / 255;
    const g = parseInt(c.substr(2, 2), 16) / 255;
    const b = parseInt(c.substr(4, 2), 16) / 255;
    const toLinear = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const contrastRatio = useMemo(() => {
    const l1 = getLuminance(contrastBg);
    const l2 = getLuminance(contrastFg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }, [contrastBg, contrastFg]);

  const wcagLevel = contrastRatio >= 7 ? 'AAA Pass' : contrastRatio >= 4.5 ? 'AA Pass' : contrastRatio >= 3 ? 'AA Large Pass' : 'Fail';

  return (
    <ToolCard title="\u{1F3A8} Color Palette & Contrast" wide>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Generate Palette</h3>
          <button onClick={generate} className="w-full btn-primary py-3 mb-4">Generate New Palette</button>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {palette.map((c, i) => (
              <div key={i} className="text-center">
                <div className="aspect-square rounded-xl mb-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-dark-border" style={{ background: c }} onClick={() => navigator.clipboard.writeText(c)} />
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{c}</p>
              </div>
            ))}
          </div>
          {palette.length === 0 && <p className="text-center text-gray-400 py-8">Click "Generate New Palette" to get started</p>}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">WCAG Contrast Checker</h3>
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Background Color</label>
              <div className="flex gap-2">
                <input type="color" value={contrastBg} onChange={(e) => setContrastBg(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer" />
                <input type="text" value={contrastBg} onChange={(e) => setContrastBg(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Text Color</label>
              <div className="flex gap-2">
                <input type="color" value={contrastFg} onChange={(e) => setContrastFg(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer" />
                <input type="text" value={contrastFg} onChange={(e) => setContrastFg(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg font-mono text-sm" />
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl text-center mb-4" style={{ background: contrastBg, color: contrastFg }}>
            <p className="text-xl font-bold">Sample Text</p>
            <p className="text-sm opacity-80">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div className={`p-5 rounded-xl text-center ${wcagLevel.includes('Pass') ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{contrastRatio.toFixed(2)}:1</p>
            <p className={`text-sm font-medium mt-1 ${wcagLevel.includes('Pass') ? 'text-green-600' : 'text-red-600'}`}>{wcagLevel}</p>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div className={`p-2 rounded-lg ${contrastRatio >= 7 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-gray-100 dark:bg-dark-bg text-gray-400'}`}>AAA Normal</div>
              <div className={`p-2 rounded-lg ${contrastRatio >= 4.5 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-gray-100 dark:bg-dark-bg text-gray-400'}`}>AA Normal</div>
              <div className={`p-2 rounded-lg ${contrastRatio >= 3 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-gray-100 dark:bg-dark-bg text-gray-400'}`}>AA Large</div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  MARKDOWN TO HTML
// ──────────────────────────────────────────────
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function MarkdownConverter() {
  const [md, setMd] = useState(`# Hello World\n\nThis is **bold** and this is *italic*.\n\n## Features\n\n- Convert Markdown to HTML\n- Supports **tables** and *lists*\n- Live preview\n\n| Name | Age | City |\n|------|-----|------|\n| Alice | 30 | NYC |\n| Bob | 25 | LA |\n\n> This is a blockquote\n\n\`\`\`javascript\nconsole.log("Hello!");\n\`\`\`\n\n---\n\nVisit [Blog-Ghar](https://bloghar.com) for more!`);

  const html = useMemo(() => {
    if (!md) return '';
    let h = md;
    // Code blocks
    h = h.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapeHtml(code.trim())}</code></pre>`);
    // Inline code
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Headings
    h = h.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    h = h.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    h = h.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    h = h.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Bold + Italic
    h = h.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    h = h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Strikethrough
    h = h.replace(/~~(.*?)~~/g, '<del>$1</del>');
    // Links & Images
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;" />');
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#4f46e5;">$1</a>');
    // Blockquotes
    h = h.replace(/^&gt; (.*$)/gim, '<blockquote>$1</blockquote>');
    // Horizontal rules
    h = h.replace(/^---$/gim, '<hr>');
    h = h.replace(/^\*\*\*$/gim, '<hr>');
    // Tables
    h = h.replace(/((?:\|.+\|\n)+)/g, (match) => {
      const rows = match.trim().split('\n').filter(r => r.trim().startsWith('|'));
      if (rows.length < 2) return match;
      let table = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
      rows.forEach((row, idx) => {
        const cells = row.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim());
        const tag = idx === 0 ? 'th' : 'td';
        const style = idx === 0 ? 'background:#f9fafb;font-weight:700;padding:0.5rem 0.75rem;border-bottom:2px solid #e5e7eb;text-align:left;' : 'padding:0.5rem 0.75rem;border-bottom:1px solid #f3f4f6;';
        table += '<tr>' + cells.map(c => `<${tag} style="${style}">${c}</${tag}>`).join('') + '</tr>';
      });
      table += '</table></div>';
      return table;
    });
    // Unordered lists
    h = h.replace(/((?:^- .+\n?)+)/gim, (match) => '<ul>' + match.trim().split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('') + '</ul>');
    // Ordered lists
    h = h.replace(/((?:^\d+\. .+\n?)+)/gim, (match) => '<ol>' + match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('') + '</ol>');
    // Paragraphs
    h = h.split('\n\n').map(block => {
      block = block.trim();
      if (!block || /^<(h|ul|ol|pre|blockquote|table|hr)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('\n\n');
    return h;
  }, [md]);

  return (
    <ToolCard title="\u{1F4CB} Markdown to HTML Converter" wide>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Markdown Input</label>
          <textarea value={md} onChange={(e) => setMd(e.target.value)} className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg resize-none font-mono text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">HTML Preview</label>
          <div className="h-96 px-4 py-3 border border-gray-300 dark:border-dark-border rounded-xl bg-gray-50 dark:bg-dark-bg overflow-auto text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
      <div className="text-right"><Btn onClick={() => navigator.clipboard.writeText(html)} variant="secondary">Copy HTML</Btn></div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  TIME ZONE CONVERTER
// ──────────────────────────────────────────────
function TimezoneConv() {
  const zones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney', 'Asia/Dubai', 'Asia/Singapore'];
  const [tz, setTz] = useState('Asia/Kolkata');
  const [time, setTime] = useState(new Date().toISOString().slice(0, 16));

  const currentTime = useMemo(() => {
    try {
      const d = new Date(time || new Date().toISOString());
      return d.toLocaleString('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'short' });
    } catch { return 'Invalid timezone'; }
  }, [time, tz]);

  const otherZones = useMemo(() => {
    const now = new Date(time || new Date().toISOString());
    return zones.filter(z => z !== tz).map(z => {
      try { return { zone: z, time: now.toLocaleString('en-US', { timeZone: z, timeStyle: 'short', hour: '2-digit', minute: '2-digit' }) }; }
      catch { return { zone: z, time: '—' }; }
    });
  }, [time, tz]);

  return (
    <ToolCard title="\u{1F30D} Time Zone Converter">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LabelInput label="Date & Time" type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
        <LabelSelect label="Time Zone" value={tz} onChange={(e) => setTz(e.target.value)}>
          {zones.map(z => <option key={z} value={z}>{z}</option>)}
        </LabelSelect>
      </div>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">Time in {tz}</p>
        <p className="text-3xl font-bold text-primary-600">{currentTime}</p>
      </div>
      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-3">World Clock Comparison</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {otherZones.map(({ zone, time: t }) => (
          <div key={zone} className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">{zone.replace('America/', '').replace('Asia/', '').replace('Europe/', '')}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{t}</p>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

// ──────────────────────────────────────────────
//  ROUTER
// ──────────────────────────────────────────────
export default function ToolPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const tool = TOOLS[slug];

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">❌</p>
          <p className="text-gray-500 mb-4">Tool not found</p>
          <Link href="/tools" className="btn-primary inline-block">Back to Tools</Link>
        </div>
      </div>
    );
  }

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: tool.name,
    description: tool.desc,
    url: `https://bloghar.com/tools/${slug}`,
    step: tool.howToSteps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  const render = () => {
    switch (tool.component) {
      case 'emi': return <EMICalc />;
      case 'sip': return <SIPCalc />;
      case 'tax': return <TaxCalc />;
      case 'affordability': return <AffordabilityCalc />;
      case 'percentage': return <PercentageCalc />;
      case 'bmi': return <BMICalc />;
      case 'age': return <AgeCalc />;
      case 'date': return <DateDiffCalc />;
      case 'gpa': return <GPACalc />;
      case 'compound': return <CompoundCalc />;
      case 'discount': return <DiscountCalc />;
      case 'tip': return <TipCalc />;
      case 'unit': return <UnitConv />;
      case 'wordcount': return <WordCounter />;
      case 'json': return <JsonFormatter />;
      case 'password': return <PasswordGen />;
      case 'base64': return <Base64Encoder />;
      case 'qr': return <QRCodeGen />;
      case 'compress': return <ImageCompressor />;
      case 'pdf': return <PDFTool />;
      case 'diff': return <TextDiff />;
      case 'color': return <ColorTool />;
      case 'markdown': return <MarkdownConverter />;
      case 'timezone': return <TimezoneConv />;
      default: return <div><p className="text-gray-500">{tool.desc}</p></div>;
    }
  };

  return (
    <div>
      {render()}
      <div className="max-w-3xl mx-auto px-4 my-8">
        <AdSlot slot="1234567891" format="auto" responsive={true} />
      </div>
      {tool.faqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Script id={`tool-schema-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id={`faq-schema-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="text-center py-8">
        <Link href="/tools" className="text-primary-600 hover:underline text-sm font-medium">← Back to All Tools</Link>
      </div>
    </div>
  );
}
