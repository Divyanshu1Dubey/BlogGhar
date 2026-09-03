'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useParams } from 'next/navigation';
import { AdSlot } from '@/components/ads/ad-slot';

// ==== TOOL DEFINITIONS ====
const TOOLS: Record<string, { name: string; icon: string; desc: string; component: string; howToSteps: { name: string; text: string }[]; faqs: { question: string; answer: string }[] }> = {
  'bmi-calculator': {
    name: 'BMI Calculator', icon: '⚖️', desc: 'Calculate your Body Mass Index instantly. Enter height and weight to check if you are underweight, normal, overweight, or obese.',
    component: 'bmi',
    howToSteps: [{ name: 'Enter Height', text: 'Input your height in centimeters (cm).' }, { name: 'Enter Weight', text: 'Input your weight in kilograms (kg).' }, { name: 'View Result', text: 'Your BMI score and category will be calculated instantly.' }],
    faqs: [
      { question: 'What is BMI?', answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. It is calculated as weight in kg divided by height in meters squared.' },
      { question: 'What is a healthy BMI?', answer: 'A healthy BMI is between 18.5 and 24.9. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese.' },
      { question: 'Is BMI accurate for everyone?', answer: 'BMI is a general indicator. It may not accurately reflect body composition for athletes, pregnant women, or older adults.' },
    ],
  },
  'age-calculator': {
    name: 'Age Calculator', icon: '🎂', desc: 'Calculate exact age from date of birth. Get years, months, days and total days lived.',
    component: 'age',
    howToSteps: [{ name: 'Enter Date of Birth', text: 'Select your birth date using the date picker.' }, { name: 'View Result', text: 'Your exact age in years, months, days, and total days will be displayed.' }],
    faqs: [
      { question: 'How is age calculated?', answer: 'Age is calculated by subtracting your birth date from the current date, accounting for leap years and varying month lengths.' },
      { question: 'Does this include leap years?', answer: 'Yes, the calculator accounts for leap years when computing total days lived.' },
    ],
  },
  'percentage-calculator': {
    name: 'Percentage Calculator', icon: '%', desc: 'Calculate percentages quickly. Find X% of Y, percentage change, and more.',
    component: 'percentage',
    howToSteps: [{ name: 'Enter Percentage', text: 'Input the percentage value you want to calculate.' }, { name: 'Enter Number', text: 'Input the base number.' }, { name: 'View Result', text: 'The result is calculated instantly.' }],
    faqs: [
      { question: 'How do you calculate percentage?', answer: 'To calculate X% of Y, use the formula: (X / 100) × Y.' },
    ],
  },
  'emi-calculator': {
    name: 'EMI Calculator', icon: '🏦', desc: 'Calculate your loan EMI (Equated Monthly Installment) with interest. Plan your home loan, car loan, or personal loan.',
    component: 'emi',
    howToSteps: [{ name: 'Enter Loan Amount', text: 'Input the principal loan amount in INR.' }, { name: 'Enter Rate & Tenure', text: 'Input the annual interest rate and loan tenure in years.' }, { name: 'View EMI Details', text: 'See monthly EMI, total interest, and total payment.' }],
    faqs: [
      { question: 'What is EMI?', answer: 'EMI (Equated Monthly Installment) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month.' },
      { question: 'How is EMI calculated?', answer: 'EMI is calculated using the formula: EMI = P × R × (1+R)^N / ((1+R)^N - 1), where P is principal, R is monthly rate, and N is tenure in months.' },
    ],
  },
  'gst-calculator': {
    name: 'GST Calculator', icon: '🧮', desc: 'Calculate GST tax amounts for India. Add or remove GST at 5%, 12%, 18%, or 28% rates.',
    component: 'gst',
    howToSteps: [{ name: 'Enter Amount', text: 'Input the base amount in INR.' }, { name: 'Select GST Rate', text: 'Choose from 5%, 12%, 18%, or 28%.' }, { name: 'View Breakdown', text: 'See original amount, GST amount, and total.' }],
    faqs: [
      { question: 'What is GST?', answer: 'GST (Goods and Services Tax) is an indirect tax levied in India on the supply of goods and services.' },
      { question: 'What are the GST slabs in India?', answer: 'GST in India has four main slabs: 5%, 12%, 18%, and 28%, plus 0% for essential items.' },
    ],
  },
  'compound-interest': {
    name: 'Compound Interest Calculator', icon: '📈', desc: 'Calculate compound interest on your investments or savings over time.',
    component: 'compound',
    howToSteps: [{ name: 'Enter Principal', text: 'Input your initial investment amount.' }, { name: 'Enter Rate & Time', text: 'Set the interest rate and time period.' }, { name: 'View Growth', text: 'See your total amount and interest earned.' }],
    faqs: [
      { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods.' },
    ],
  },
  'date-difference': {
    name: 'Date Difference Calculator', icon: '📅', desc: 'Calculate days between two dates. Perfect for project timelines and event planning.',
    component: 'date',
    howToSteps: [{ name: 'Select Dates', text: 'Choose two dates from the date pickers.' }, { name: 'View Difference', text: 'The number of days between the dates is shown instantly.' }],
    faqs: [
      { question: 'Does this include leap years?', answer: 'Yes, the calculation accounts for leap years automatically.' },
    ],
  },
  'gpa-calculator': {
    name: 'GPA Calculator', icon: '🎓', desc: 'Calculate your Grade Point Average from course grades and credits.',
    component: 'gpa',
    howToSteps: [{ name: 'Add Courses', text: 'Enter course names, select grades, and set credit hours.' }, { name: 'Calculate', text: 'Your GPA is automatically calculated.' }],
    faqs: [
      { question: 'How is GPA calculated?', answer: 'GPA is calculated by dividing total grade points (grade × credit hours) by total credit hours.' },
    ],
  },
  'tip-calculator': {
    name: 'Tip Calculator', icon: '💵', desc: 'Calculate tip amount and split the bill among friends.',
    component: 'tip',
    howToSteps: [{ name: 'Enter Bill', text: 'Input your bill amount.' }, { name: 'Set Tip %', text: 'Use the slider to set tip percentage.' }, { name: 'View Split', text: 'See tip amount, total, and per-person cost.' }],
    faqs: [
      { question: 'How do you calculate tip?', answer: 'Tip amount = Bill amount × Tip percentage / 100. Per person = (Bill + Tip) / Number of people.' },
    ],
  },
  'discount-calculator': {
    name: 'Discount Calculator', icon: '🏷️', desc: 'Calculate discounted prices and savings on your purchases.',
    component: 'discount',
    howToSteps: [{ name: 'Enter Price', text: 'Input the original price.' }, { name: 'Set Discount', text: 'Enter the discount percentage.' }, { name: 'View Savings', text: 'See savings amount and final price.' }],
    faqs: [
      { question: 'How do I calculate discount?', answer: 'Discount = Original Price × Discount % / 100. Final Price = Original Price - Discount.' },
    ],
  },
  'timezone-converter': {
    name: 'Time Zone Converter', icon: '🌍', desc: 'Convert date and time between different time zones around the world.',
    component: 'timezone',
    howToSteps: [{ name: 'Select Time', text: 'Choose your date and time.' }, { name: 'Choose Zone', text: 'Select the target time zone.' }, { name: 'View Conversion', text: 'See the converted time instantly.' }],
    faqs: [
      { question: 'How many time zones are there?', answer: 'There are approximately 24 main time zones, plus many fractional offsets used by different countries.' },
    ],
  },
  'currency-converter': {
    name: 'Currency Converter', icon: '💱', desc: 'Convert between world currencies with live exchange rates.',
    component: 'currency',
    howToSteps: [{ name: 'Enter Amount', text: 'Input the amount you want to convert.' }, { name: 'Select Currencies', text: 'Choose source and target currencies.' }, { name: 'View Conversion', text: 'Get the converted amount instantly.' }],
    faqs: [
      { question: 'Are exchange rates live?', answer: 'This tool uses static reference rates for demonstration. In production, rates are fetched from live APIs.' },
    ],
  },
  'length-converter': {
    name: 'Length Converter', icon: '📏', desc: 'Convert between meters, kilometers, feet, inches, miles, and more.',
    component: 'length',
    howToSteps: [{ name: 'Enter Value', text: 'Input the length value.' }, { name: 'Select Units', text: 'Choose source and target units.' }, { name: 'View Result', text: 'Get converted value instantly.' }],
    faqs: [{ question: 'What units are supported?', answer: 'Meter, Kilometer, Centimeter, Millimeter, Inch, Foot, Yard, and Mile.' }],
  },
  'weight-converter': {
    name: 'Weight Converter', icon: '⚖️', desc: 'Convert between kilograms, pounds, grams, ounces, and more.',
    component: 'weight',
    howToSteps: [{ name: 'Enter Value', text: 'Input the weight value.' }, { name: 'Select Units', text: 'Choose source and target units.' }, { name: 'View Result', text: 'Get converted value instantly.' }],
    faqs: [{ question: 'What units are supported?', answer: 'Kilogram, Gram, Pound, Ounce, and Ton.' }],
  },
  'temperature-converter': {
    name: 'Temperature Converter', icon: '🌡️', desc: 'Convert between Celsius, Fahrenheit, and Kelvin.',
    component: 'temperature',
    howToSteps: [{ name: 'Enter Value', text: 'Input the temperature value.' }, { name: 'Select Units', text: 'Choose source and target units.' }, { name: 'View Result', text: 'Get converted temperature.' }],
    faqs: [
      { question: 'How do I convert Celsius to Fahrenheit?', answer: 'Fahrenheit = (Celsius × 9/5) + 32.' },
      { question: 'How do I convert Celsius to Kelvin?', answer: 'Kelvin = Celsius + 273.15.' },
    ],
  },
  'speed-converter': {
    name: 'Speed Converter', icon: '🏎️', desc: 'Convert between km/h, m/s, mph, and knots.',
    component: 'speed',
    howToSteps: [{ name: 'Enter Value', text: 'Input the speed value.' }, { name: 'Select Units', text: 'Choose source and target units.' }, { name: 'View Result', text: 'Get converted speed.' }],
    faqs: [{ question: 'What units are supported?', answer: 'km/h, m/s, mph (miles per hour), and knots (nautical miles per hour).' }],
  },
  'area-converter': {
    name: 'Area Converter', icon: '📐', desc: 'Convert between m², km², ft², acres, and hectares.',
    component: 'area',
    howToSteps: [{ name: 'Enter Value', text: 'Input the area value.' }, { name: 'Select Units', text: 'Choose source and target units.' }, { name: 'View Result', text: 'Get converted area.' }],
    faqs: [{ question: 'What units are supported?', answer: 'Square meter, square kilometer, square foot, acre, and hectare.' }],
  },
  'number-to-words': {
    name: 'Number to Words', icon: '🔢', desc: 'Convert any number to words in English. Supports crores and lakhs.',
    component: 'numwords',
    howToSteps: [{ name: 'Enter Number', text: 'Input any number in the field.' }, { name: 'View Words', text: 'The number is converted to English words instantly.' }],
    faqs: [
      { question: 'Does this support Indian number system?', answer: 'Yes, it supports lakhs and crores for the Indian numbering system.' },
    ],
  },
  'roman-numeral': {
    name: 'Roman Numeral Converter', icon: '🏛️', desc: 'Convert numbers to Roman numerals and vice versa.',
    component: 'roman',
    howToSteps: [{ name: 'Enter Number', text: 'Input a number between 1 and 3999.' }, { name: 'View Roman', text: 'The Roman numeral equivalent is displayed.' }],
    faqs: [
      { question: 'What is the maximum number?', answer: 'This converter supports numbers up to 3999, which is the maximum standard Roman numeral range.' },
    ],
  },
  'word-counter': {
    name: 'Word Counter', icon: '📝', desc: 'Count words, characters, sentences, and paragraphs. Check reading time.',
    component: 'wordcount',
    howToSteps: [{ name: 'Type or Paste', text: 'Enter your text in the textarea.' }, { name: 'View Stats', text: 'Real-time word count, character count, and reading time are shown.' }],
    faqs: [
      { question: 'Is my text saved?', answer: 'No, your text is not saved. Everything happens locally in your browser.' },
    ],
  },
  'text-case-converter': {
    name: 'Text Case Converter', icon: 'Aa', desc: 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, and more.',
    component: 'textcase',
    howToSteps: [{ name: 'Enter Text', text: 'Type or paste your text.' }, { name: 'View Conversions', text: 'See text in all case styles simultaneously.' }, { name: 'Copy', text: 'Click copy button on any style to use it.' }],
    faqs: [
      { question: 'What case styles are supported?', answer: 'Uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.' },
    ],
  },
  'json-formatter': {
    name: 'JSON Formatter', icon: '{ }', desc: 'Format, validate, and minify JSON data. Fix syntax errors instantly.',
    component: 'json',
    howToSteps: [{ name: 'Paste JSON', text: 'Paste your raw JSON data in the input area.' }, { name: 'Format or Minify', text: 'Click Format to prettify or Minify to compress.' }, { name: 'Copy Result', text: 'Copy the output and use it.' }],
    faqs: [
      { question: 'Does it validate JSON?', answer: 'Yes, it validates and shows any syntax errors in your JSON.' },
    ],
  },
  'password-generator': {
    name: 'Password Generator', icon: '🔒', desc: 'Generate strong, secure passwords with customizable options.',
    component: 'password',
    howToSteps: [{ name: 'Set Options', text: 'Choose length and character types (uppercase, lowercase, numbers, symbols).' }, { name: 'Generate', text: 'Click generate to create a secure password.' }, { name: 'Copy', text: 'Copy the password to clipboard.' }],
    faqs: [
      { question: 'How secure is the generated password?', answer: 'Passwords are generated client-side using secure random selection with configurable complexity options.' },
    ],
  },
  'uuid-generator': {
    name: 'UUID Generator', icon: '🔑', desc: 'Generate random UUIDs (v4) for your projects.',
    component: 'uuid',
    howToSteps: [{ name: 'Click Generate', text: 'Click the generate button to create 5 UUIDs.' }, { name: 'Copy', text: 'Click copy on any UUID to use it.' }],
    faqs: [
      { question: 'What is a UUID?', answer: 'UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. UUID v4 is randomly generated.' },
    ],
  },
  'markdown-editor': {
    name: 'Markdown Editor', icon: '📋', desc: 'Write and preview markdown in real-time. Supports headings, bold, italic, code, and more.',
    component: 'markdown',
    howToSteps: [{ name: 'Write Markdown', text: 'Type your markdown content in the editor.' }, { name: 'View Preview', text: 'See the rendered HTML in real-time.' }],
    faqs: [
      { question: 'What markdown syntax is supported?', answer: 'Headings (#), bold (**), italic (*), code (`), and line breaks are supported.' },
    ],
  },
  'online-notepad': {
    name: 'Online Notepad', icon: '📒', desc: 'Quick online notepad with auto-save in browser storage.',
    component: 'notepad',
    howToSteps: [{ name: 'Start Typing', text: 'Begin typing in the notepad area.' }, { name: 'Auto-save', text: 'Your notes are automatically saved in your browser.' }],
    faqs: [
      { question: 'Are my notes backed up?', answer: 'Notes are saved locally in your browser. They are not backed up to a server.' },
    ],
  },
  'qr-code-generator': {
    name: 'QR Code Generator', icon: '📱', desc: 'Generate custom QR codes for URLs, text, or any content. Download as PNG.',
    component: 'qr',
    howToSteps: [{ name: 'Enter Content', text: 'Type or paste the URL or text you want to encode.' }, { name: 'Adjust Size', text: 'Use the slider to set QR code size.' }, { name: 'Download', text: 'Click download to save the QR code as a PNG image.' }],
    faqs: [
      { question: 'What can QR codes contain?', answer: 'QR codes can contain URLs, plain text, contact info, WiFi credentials, and more.' },
      { question: 'Can I use QR codes commercially?', answer: 'Yes, the generated QR codes can be used for personal or commercial purposes.' },
    ],
  },
  'color-palette': {
    name: 'Color Palette Generator', icon: '🎨', desc: 'Generate beautiful color palettes. Click colors to copy hex codes.',
    component: 'color',
    howToSteps: [{ name: 'Generate', text: 'Click generate to create a new color palette.' }, { name: 'Copy Colors', text: 'Click any color to copy its hex code.' }],
    faqs: [
      { question: 'How are colors generated?', answer: 'Colors are generated using HSL color space with varying hue values for harmony.' },
    ],
  },
  'base64-encoder': {
    name: 'Base64 Encoder/Decoder', icon: '🔤', desc: 'Encode text to Base64 or decode Base64 back to plain text.',
    component: 'base64',
    howToSteps: [{ name: 'Enter Text', text: 'Type or paste the text you want to encode or decode.' }, { name: 'Choose Mode', text: 'Select Encode or Decode mode.' }, { name: 'View Result', text: 'The result appears instantly below.' }],
    faqs: [
      { question: 'What is Base64?', answer: 'Base64 is an encoding scheme that represents binary data in ASCII string format using 64 characters.' },
    ],
  },
  'hash-generator': {
    name: 'Hash Generator', icon: '🔐', desc: 'Generate SHA-1, SHA-256, and SHA-512 cryptographic hashes.',
    component: 'hash',
    howToSteps: [{ name: 'Enter Text', text: 'Type or paste the text you want to hash.' }, { name: 'View Hashes', text: 'SHA-1, SHA-256, and SHA-512 hashes appear below.' }],
    faqs: [
      { question: 'What is a hash function?', answer: 'A hash function converts data of arbitrary size into a fixed-size string of characters, which is typically used for data integrity verification.' },
    ],
  },
};

// ==== SHARED UI ====
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">{title}</h1>
        <p className="text-gray-500">Free online tool - no registration required</p>
      </div>
      <div className="card p-8">{children}</div>
    </div>
  );
}

// ==== COMPONENTS ====
function BMICalc() {
  const [h, setH] = useState(170); const [w, setW] = useState(70);
  const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const color = cat === 'Normal' ? 'text-green-600 bg-green-50' : cat === 'Underweight' ? 'text-blue-600 bg-blue-50' : cat === 'Overweight' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
  return (
    <Card title="⚖️ BMI Calculator">
      <div className="space-y-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Height (cm)</label><input type="number" value={h} onChange={(e) => setH(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Weight (kg)</label><input type="number" value={w} onChange={(e) => setW(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
      </div>
      <div className={`p-6 rounded-xl text-center ${color.split(' ')[1]}`}>
        <p className="text-sm text-gray-600">Your BMI</p>
        <p className={`text-5xl font-bold ${color.split(' ')[0]}`}>{bmi}</p>
        <p className="mt-2 font-medium">{cat}</p>
      </div>
    </Card>
  );
}

function AgeCalc() {
  const [birth, setBirth] = useState('2000-01-01');
  const now = new Date(); const b = new Date(birth);
  let years = now.getFullYear() - b.getFullYear(); let months = now.getMonth() - b.getMonth(); let days = now.getDate() - b.getDate();
  if (days < 0) { months--; days += 30; }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((now.getTime() - b.getTime()) / 86400000);
  return (
    <Card title="🎂 Age Calculator">
      <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg mb-6" />
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center"><p className="text-3xl font-bold text-primary-600">{years}</p><p className="text-xs text-gray-500">Years</p></div>
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center"><p className="text-3xl font-bold text-primary-600">{months}</p><p className="text-xs text-gray-500">Months</p></div>
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center"><p className="text-3xl font-bold text-primary-600">{days}</p><p className="text-xs text-gray-500">Days</p></div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center"><p className="text-3xl font-bold text-green-600">{totalDays}</p><p className="text-xs text-gray-500">Total Days</p></div>
      </div>
    </Card>
  );
}

function PercentageCalc() {
  const [pct, setPct] = useState(20); const [n, setN] = useState(200);
  return (
    <Card title="% Percentage Calculator">
      <div className="space-y-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Percentage (%)</label><input type="number" value={pct} onChange={(e) => setPct(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Number</label><input type="number" value={n} onChange={(e) => setN(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
      </div>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
        <p className="text-sm text-gray-600">Result</p>
        <p className="text-5xl font-bold text-primary-600">{((pct / 100) * n).toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-2">{pct}% of {n} = {((pct / 100) * n).toFixed(2)}</p>
      </div>
    </Card>
  );
}

function EMICalc() {
  const [p, setP] = useState(0); const [r, setR] = useState(9); const [t, setT] = useState(5);
  const n = t * 12, ri = r / 12 / 100;
  const emi = +(p * ri * Math.pow(1 + ri, n) / (Math.pow(1 + ri, n) - 1)).toFixed(2);
  const total = +(emi * n).toFixed(2); const interest = +(total - p).toFixed(2);
  return (
    <Card title="🏦 EMI Calculator">
      <div className="space-y-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Loan Amount (₹)</label><input type="number" value={p} onChange={(e) => setP(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Interest Rate (% p.a)</label><input type="number" step="0.1" value={r} onChange={(e) => setR(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Tenure (years)</label><input type="number" value={t} onChange={(e) => setT(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-primary-50 rounded-xl text-center"><p className="text-xs text-gray-500">Monthly EMI</p><p className="text-xl font-bold text-primary-600">₹{emi.toLocaleString()}</p></div>
        <div className="p-4 bg-yellow-50 rounded-xl text-center"><p className="text-xs text-gray-500">Total Interest</p><p className="text-xl font-bold text-yellow-600">₹{interest.toLocaleString()}</p></div>
        <div className="p-4 bg-blue-50 rounded-xl text-center"><p className="text-xs text-gray-500">Total Payment</p><p className="text-xl font-bold text-blue-600">₹{total.toLocaleString()}</p></div>
      </div>
    </Card>
  );
}

function GSTCalc() {
  const [amount, setAmount] = useState(0); const [rate, setRate] = useState(18);
  const gst = +(amount * rate / 100).toFixed(2);
  return (
    <Card title="🧮 GST Calculator (India)">
      <div className="space-y-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Amount (₹)</label><input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div>
          <label className="text-sm font-medium block mb-1">GST Rate (%)</label>
          <select value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg">
            {[5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl text-center"><p className="text-xs text-gray-500">Original</p><p className="text-xl font-bold">₹{amount}</p></div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center"><p className="text-xs text-gray-500">GST ({rate}%)</p><p className="text-xl font-bold text-orange-600">₹{gst}</p></div>
        <div className="p-4 bg-primary-50 rounded-xl text-center"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold text-primary-600">₹{(amount + gst).toFixed(2)}</p></div>
      </div>
    </Card>
  );
}

function CompoundCalc() {
  const [p, setP] = useState(0); const [r, setR] = useState(8); const [t, setT] = useState(10); const [n, setN] = useState(12);
  const amt = +(p * Math.pow(1 + r / 100 / n, n * t)).toFixed(2); const ci = +(amt - p).toFixed(2);
  return (
    <Card title="📈 Compound Interest Calculator">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Principal (₹)</label><input type="number" value={p} onChange={(e) => setP(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Rate (%)</label><input type="number" step="0.1" value={r} onChange={(e) => setR(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Time (years)</label><input type="number" value={t} onChange={(e) => setT(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Compounds/year</label><input type="number" value={n} onChange={(e) => setN(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl text-center"><p className="text-xs text-gray-500">Principal</p><p className="text-xl font-bold">₹{p}</p></div>
        <div className="p-4 bg-green-50 rounded-xl text-center"><p className="text-xs text-gray-500">Interest</p><p className="text-xl font-bold text-green-600">₹{ci.toLocaleString()}</p></div>
        <div className="p-4 bg-primary-50 rounded-xl text-center"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold text-primary-600">₹{amt.toLocaleString()}</p></div>
      </div>
    </Card>
  );
}

function DateDiff() {
  const [d1, setD1] = useState('2024-01-01'); const [d2, setD2] = useState('2024-12-31');
  const diff = Math.abs(Math.floor((new Date(d2).getTime() - new Date(d1).getTime()) / 86400000));
  return (
    <Card title="📅 Date Difference Calculator">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">From</label><input type="date" value={d1} onChange={(e) => setD1(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">To</label><input type="date" value={d2} onChange={(e) => setD2(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
      </div>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
        <p className="text-5xl font-bold text-primary-600">{diff.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-2">days between</p>
      </div>
    </Card>
  );
}

function GPACalc() {
  const [grades, setGrades] = useState([{ name: 'Math', grade: 'A', credits: 4 }, { name: 'Science', grade: 'B', credits: 4 }]);
  const gradePoints: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
  const gpa = useMemo(() => {
    const total = grades.reduce((s, g) => s + (gradePoints[g.grade] || 0) * g.credits, 0);
    const credits = grades.reduce((s, g) => s + g.credits, 0);
    return credits ? (total / credits).toFixed(2) : '0';
  }, [grades]);
  return (
    <Card title="🎓 GPA Calculator">
      <div className="space-y-2 mb-4">
        {grades.map((g, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input placeholder="Course" value={g.name} onChange={(e) => { const n = [...grades]; n[i].name = e.target.value; setGrades(n); }} className="col-span-6 px-2 py-2 border rounded-lg dark:bg-dark-bg text-sm" />
            <select value={g.grade} onChange={(e) => { const n = [...grades]; n[i].grade = e.target.value; setGrades(n); }} className="col-span-3 px-2 py-2 border rounded-lg dark:bg-dark-bg text-sm">
              {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input type="number" value={g.credits} onChange={(e) => { const n = [...grades]; n[i].credits = +e.target.value; setGrades(n); }} className="col-span-2 px-2 py-2 border rounded-lg dark:bg-dark-bg text-sm" />
            <button onClick={() => setGrades(grades.filter((_, idx) => idx !== i))} className="col-span-1 text-red-500">✕</button>
          </div>
        ))}
      </div>
      <button onClick={() => setGrades([...grades, { name: '', grade: 'A', credits: 3 }])} className="text-sm text-primary-600 mb-4">+ Add Course</button>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
        <p className="text-sm text-gray-500">GPA</p>
        <p className="text-5xl font-bold text-primary-600">{gpa}</p>
      </div>
    </Card>
  );
}

function TipCalc() {
  const [bill, setBill] = useState(0); const [tip, setTip] = useState(15); const [people, setPeople] = useState(2);
  const tipAmt = +(bill * tip / 100).toFixed(2); const total = +(bill + tipAmt).toFixed(2); const perPerson = +(total / people).toFixed(2);
  return (
    <Card title="💵 Tip Calculator">
      <div className="space-y-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Bill Amount (₹)</label><input type="number" value={bill} onChange={(e) => setBill(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Tip %: {tip}%</label><input type="range" min="0" max="50" value={tip} onChange={(e) => setTip(+e.target.value)} className="w-full" /></div>
        <div><label className="text-sm font-medium block mb-1">Number of People</label><input type="number" min="1" value={people} onChange={(e) => setPeople(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-50 rounded-xl text-center"><p className="text-xs text-gray-500">Tip</p><p className="text-xl font-bold text-yellow-600">₹{tipAmt}</p></div>
        <div className="p-4 bg-primary-50 rounded-xl text-center"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold text-primary-600">₹{total}</p></div>
        <div className="p-4 bg-green-50 rounded-xl text-center"><p className="text-xs text-gray-500">Per Person</p><p className="text-xl font-bold text-green-600">₹{perPerson}</p></div>
      </div>
    </Card>
  );
}

function DiscountCalc() {
  const [price, setPrice] = useState(0); const [discount, setDiscount] = useState(25);
  const saved = +(price * discount / 100).toFixed(2);
  return (
    <Card title="🏷️ Discount Calculator">
      <div className="space-y-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Original Price (₹)</label><input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Discount (%)</label><input type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl text-center"><p className="text-xs text-gray-500">Original</p><p className="text-xl font-bold">₹{price}</p></div>
        <div className="p-4 bg-red-50 rounded-xl text-center"><p className="text-xs text-gray-500">You Save</p><p className="text-xl font-bold text-red-600">₹{saved}</p></div>
        <div className="p-4 bg-green-50 rounded-xl text-center"><p className="text-xs text-gray-500">Final</p><p className="text-xl font-bold text-green-600">₹{(price - saved).toFixed(2)}</p></div>
      </div>
    </Card>
  );
}

function TimezoneConverter() {
  const zones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney'];
  const [tz, setTz] = useState('Asia/Kolkata'); const [time, setTime] = useState(new Date().toISOString().slice(0, 16));
  const result = useMemo(() => { try { return new Date(time).toLocaleString('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'short' }); } catch { return 'Invalid'; } }, [tz, time]);
  return (
    <Card title="🌍 Time Zone Converter">
      <div className="space-y-4 mb-6">
        <div><label className="text-sm font-medium block mb-1">Date/Time</label><input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">Target Zone</label>
          <select value={tz} onChange={(e) => setTz(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg">
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center"><p className="text-sm text-gray-500">Local Time in {tz}</p><p className="text-2xl font-bold text-primary-600 mt-2">{result}</p></div>
    </Card>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState(100); const [from, setFrom] = useState('USD'); const [to, setTo] = useState('EUR');
  const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 149, CAD: 1.36, AUD: 1.52, CNY: 7.24 };
  const result = +((amount / rates[from]) * rates[to]).toFixed(2);
  return (
    <Card title="💱 Currency Converter">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div><label className="text-sm font-medium block mb-1">Amount</label><input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg" /></div>
        <div><label className="text-sm font-medium block mb-1">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg">{Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div><label className="text-sm font-medium block mb-1">To</label><select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg">{Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center"><p className="text-sm text-gray-500">{amount} {from} =</p><p className="text-4xl font-bold text-primary-600">{result} {to}</p></div>
    </Card>
  );
}

function UnitConverter({ type }: { type: 'length' | 'weight' | 'temperature' | 'speed' | 'area' }) {
  const conversions: Record<string, { units: Record<string, number>; formulas?: Record<string, (v: number) => number> }> = {
    length: { units: { Meter: 1, Kilometer: 0.001, Centimeter: 100, Millimeter: 1000, Inch: 39.37, Foot: 3.28, Yard: 1.094, Mile: 0.000621 } },
    weight: { units: { Kilogram: 1, Gram: 1000, Pound: 2.205, Ounce: 35.27, Ton: 0.001 } },
    temperature: { units: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 }, formulas: { Celsius: (v) => v, Fahrenheit: (v) => (v - 32) * 5 / 9, Kelvin: (v) => v - 273.15 } },
    speed: { units: { 'km/h': 1, 'm/s': 0.278, 'mph': 0.621, 'knot': 0.540 } },
    area: { units: { 'm²': 1, 'km²': 0.000001, 'ft²': 10.764, 'acre': 0.000247, 'hectare': 0.0001 } },
  };
  const cfg = conversions[type];
  const [val, setVal] = useState(1); const [from, setFrom] = useState(Object.keys(cfg.units)[0]); const [to, setTo] = useState(Object.keys(cfg.units)[1]);
  const result = useMemo(() => {
    if (type === 'temperature') {
      const celsius = cfg.formulas![from](val);
      return +(cfg.formulas![to] === cfg.formulas!.Fahrenheit ? (celsius * 9 / 5 + 32) : cfg.formulas![to] === cfg.formulas!.Kelvin ? celsius + 273.15 : celsius).toFixed(2);
    }
    return +((val / cfg.units[from]) * cfg.units[to]).toFixed(4);
  }, [val, from, to]);
  return (
    <Card title={`📏 ${type.charAt(0).toUpperCase() + type.slice(1)} Converter`}>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <input type="number" value={val} onChange={(e) => setVal(+e.target.value)} className="px-3 py-2.5 border rounded-lg dark:bg-dark-bg" />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2.5 border rounded-lg dark:bg-dark-bg">{Object.keys(cfg.units).map(u => <option key={u} value={u}>{u}</option>)}</select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2.5 border rounded-lg dark:bg-dark-bg">{Object.keys(cfg.units).map(u => <option key={u} value={u}>{u}</option>)}</select>
      </div>
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center"><p className="text-sm text-gray-500">{val} {from} =</p><p className="text-4xl font-bold text-primary-600">{result} {to}</p></div>
    </Card>
  );
}

function NumberToWords() {
  const [n, setN] = useState(0);
  const numWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const convert = (num: number): string => {
      if (num < 20) return ones[num]; if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convert(num % 100) : '');
      if (num < 100000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convert(num % 1000) : '');
      if (num < 10000000) return convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convert(num % 100000) : '');
      return convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + convert(num % 10000000) : '');
    };
    return convert(Math.floor(Math.abs(num)));
  };
  return (
    <Card title="🔢 Number to Words">
      <input type="number" value={n} onChange={(e) => setN(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg mb-6" />
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl"><p className="text-2xl font-bold text-primary-600 capitalize">{numWords(n)}</p></div>
    </Card>
  );
}

function RomanConverter() {
  const [n, setN] = useState(0);
  const roman = (num: number): string => {
    const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let r = ''; for (const [v, s] of map) { while (num >= v) { r += s; num -= v; } } return r;
  };
  return (
    <Card title="🏛️ Roman Numeral Converter">
      <input type="number" min="1" max="3999" value={n} onChange={(e) => setN(+e.target.value)} className="w-full px-3 py-2.5 border rounded-lg dark:bg-dark-bg mb-6" />
      <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center"><p className="text-5xl font-bold text-primary-600">{roman(n)}</p></div>
    </Card>
  );
}

function WordCounter() {
  const [t, setT] = useState('');
  const stats = { words: t.trim() ? t.trim().split(/\s+/).length : 0, chars: t.length, sentences: t.split(/[.!?]+/).filter(s => s.trim()).length, paragraphs: t.split(/\n\n+/).filter(p => p.trim()).length, read: Math.ceil((t.trim() ? t.trim().split(/\s+/).length : 0) / 200) };
  return (
    <Card title="📝 Word Counter">
      <textarea value={t} onChange={(e) => setT(e.target.value)} placeholder="Type or paste text..." className="w-full h-48 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none mb-4" />
      <div className="grid grid-cols-5 gap-3">
        <div className="p-3 bg-primary-50 rounded-xl text-center"><p className="text-2xl font-bold text-primary-600">{stats.words}</p><p className="text-xs text-gray-500">Words</p></div>
        <div className="p-3 bg-blue-50 rounded-xl text-center"><p className="text-2xl font-bold text-blue-600">{stats.chars}</p><p className="text-xs text-gray-500">Chars</p></div>
        <div className="p-3 bg-green-50 rounded-xl text-center"><p className="text-2xl font-bold text-green-600">{stats.sentences}</p><p className="text-xs text-gray-500">Sent.</p></div>
        <div className="p-3 bg-yellow-50 rounded-xl text-center"><p className="text-2xl font-bold text-yellow-600">{stats.paragraphs}</p><p className="text-xs text-gray-500">Para</p></div>
        <div className="p-3 bg-orange-50 rounded-xl text-center"><p className="text-2xl font-bold text-orange-600">{stats.read}</p><p className="text-xs text-gray-500">Min</p></div>
      </div>
    </Card>
  );
}

function TextCase() {
  const [t, setT] = useState('');
  return (
    <Card title="Aa Text Case Converter">
      <textarea value={t} onChange={(e) => setT(e.target.value)} placeholder="Type text..." className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none mb-3" />
      <div className="space-y-2">
        {[['UPPERCASE', t.toUpperCase()], ['lowercase', t.toLowerCase()], ['Title Case', t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())], ['Sentence case', t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()], ['camelCase', t.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())], ['snake_case', t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_')], ['kebab-case', t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')]].map(([label, val]) => (
          <div key={label as string} className="flex items-center gap-2"><span className="w-24 text-sm font-medium text-gray-500">{label}</span><input readOnly value={val as string} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg text-sm" /><button onClick={() => navigator.clipboard.writeText(val as string)} className="px-2 py-1 text-xs bg-gray-200 dark:bg-dark-border rounded">Copy</button></div>
        ))}
      </div>
    </Card>
  );
}

function JsonFormatter() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [error, setError] = useState('');
  const format = () => { try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setError(''); } catch (e: any) { setError(e.message); setOutput(''); } };
  return (
    <Card title='{ } JSON Formatter'>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key":"value"}' className="h-64 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none font-mono text-sm" />
        <textarea readOnly value={output} placeholder="Formatted JSON..." className="h-64 px-3 py-2 border rounded-lg dark:bg-dark-bg bg-gray-50 dark:bg-dark-card resize-none font-mono text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={format} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Format</button>
        <button onClick={() => setOutput(JSON.stringify(JSON.parse(input)))} className="px-4 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg">Minify</button>
        {error && <p className="text-red-500 text-sm py-2 ml-3">{error}</p>}
      </div>
    </Card>
  );
}

function PasswordGen() {
  const [len, setLen] = useState(16); const [opts, setOpts] = useState({ u: true, l: true, n: true, s: true }); const [pwd, setPwd] = useState('');
  const generate = () => {
    let pool = ''; if (opts.u) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (opts.l) pool += 'abcdefghijklmnopqrstuvwxyz'; if (opts.n) pool += '0123456789'; if (opts.s) pool += '!@#$%^&*()_+-=[]{}';
    let r = ''; for (let i = 0; i < len; i++) r += pool[Math.floor(Math.random() * pool.length)]; setPwd(r);
  };
  return (
    <Card title="🔒 Password Generator">
      <div className="mb-3"><label className="text-sm font-medium block mb-1">Length: {len}</label><input type="range" min="4" max="64" value={len} onChange={(e) => setLen(+e.target.value)} className="w-full" /></div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[['u', 'Uppercase'], ['l', 'Lowercase'], ['n', 'Numbers'], ['s', 'Symbols']].map(([k, l]) => (
          <label key={k as string} className="flex items-center gap-2"><input type="checkbox" checked={opts[k as 'u']} onChange={(e) => setOpts({ ...opts, [k as string]: e.target.checked })} /><span className="text-sm">{l}</span></label>
        ))}
      </div>
      <button onClick={generate} className="w-full btn-primary py-3 mb-3">Generate</button>
      {pwd && <div className="flex gap-2"><input readOnly value={pwd} className="flex-1 px-3 py-2.5 bg-gray-100 dark:bg-dark-bg rounded-lg font-mono" /><button onClick={() => navigator.clipboard.writeText(pwd)} className="px-4 py-2 bg-gray-200 rounded-lg">Copy</button></div>}
    </Card>
  );
}

function UuidGen() {
  const [uuids, setUuids] = useState<string[]>([]);
  const generate = () => {
    const newUuids = Array.from({ length: 5 }, () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);
    }));
    setUuids([...newUuids, ...uuids].slice(0, 10));
  };
  return (
    <Card title="🔑 UUID Generator">
      <button onClick={generate} className="w-full btn-primary py-3 mb-4">Generate 5 UUIDs</button>
      <div className="space-y-2">
        {uuids.map((u, i) => (
          <div key={i} className="flex gap-2"><input readOnly value={u} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg font-mono text-sm" /><button onClick={() => navigator.clipboard.writeText(u)} className="px-3 py-1 bg-gray-200 rounded text-sm">Copy</button></div>
        ))}
      </div>
    </Card>
  );
}

function MarkdownEditor() {
  const [md, setMd] = useState('# Hello\n\nThis is **markdown**!');
  const html = useMemo(() => { return md.replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>').replace(/`(.*?)`/g, '<code>$1</code>'); }, [md]);
  return (
    <Card title="📋 Markdown Editor">
      <div className="grid grid-cols-2 gap-3">
        <textarea value={md} onChange={(e) => setMd(e.target.value)} className="h-96 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none font-mono text-sm" />
        <div className="h-96 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-dark-card overflow-auto prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Card>
  );
}

function Notepad() {
  const [text, setText] = useState('');
  useEffect(() => { const saved = localStorage.getItem('notepad'); if (saved) setText(saved); }, []);
  useEffect(() => { localStorage.setItem('notepad', text); }, [text]);
  return (
    <Card title="📒 Online Notepad">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing... Auto-saved!" className="w-full h-96 px-4 py-3 border rounded-lg dark:bg-dark-bg resize-none text-base" />
      <div className="flex justify-between mt-3 text-sm text-gray-500">
        <span>{text.length} characters • {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
        <button onClick={() => { setText(''); localStorage.removeItem('notepad'); }} className="text-red-500">Clear</button>
      </div>
    </Card>
  );
}

function QRCodeGen() {
  const [text, setText] = useState(''); const [size, setSize] = useState(256);
  const url = text ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}` : '';
  return (
    <Card title="📱 QR Code Generator">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="URL or text..." className="w-full h-20 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none mb-3" />
      <div className="mb-4"><label className="text-sm font-medium block mb-1">Size: {size}px</label><input type="range" min="128" max="512" step="64" value={size} onChange={(e) => setSize(+e.target.value)} className="w-full" /></div>
      {url && <div className="text-center p-6 bg-gray-50 dark:bg-dark-bg rounded-xl"><img src={url} alt="QR" className="mx-auto mb-3" /><a href={url} download="qr.png" className="btn-primary inline-block">Download</a></div>}
    </Card>
  );
}

function ColorPalette() {
  const [colors, setColors] = useState<string[]>([]);
  const generate = () => { const base = Math.floor(Math.random() * 360); setColors(Array.from({ length: 5 }, (_, i) => `hsl(${(base + i * 30) % 360}, 70%, 50%)`)); };
  return (
    <Card title="🎨 Color Palette Generator">
      <button onClick={generate} className="w-full btn-primary py-3 mb-4">Generate Palette</button>
      <div className="grid grid-cols-5 gap-3">
        {colors.map((c, i) => (
          <div key={i} className="text-center">
            <div className="aspect-square rounded-xl mb-2 cursor-pointer" style={{ background: c }} onClick={() => navigator.clipboard.writeText(c)} />
            <p className="text-xs font-mono">{c}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Base64Encoder() {
  const [input, setInput] = useState(''); const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const result = useMemo(() => { try { return mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))); } catch { return 'Invalid input'; } }, [input, mode]);
  return (
    <Card title="🔤 Base64 Encoder/Decoder">
      <div className="flex gap-2 mb-3">
        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'encode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'decode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>Decode</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none mb-3" />
      <textarea readOnly value={result} placeholder="Result..." className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-dark-bg bg-gray-50 dark:bg-dark-card resize-none" />
    </Card>
  );
}

function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });
  useEffect(() => {
    if (!text) { setHashes({ sha1: '', sha256: '', sha512: '' }); return; }
    (async () => {
      const enc = new TextEncoder().encode(text); const results: any = {};
      for (const algo of ['SHA-1', 'SHA-256', 'SHA-512']) {
        try { results[algo.toLowerCase().replace('-', '')] = Array.from(new Uint8Array(await crypto.subtle.digest(algo, enc))).map(b => b.toString(16).padStart(2, '0')).join(''); } catch {}
      }
      setHashes(results as any);
    })();
  }, [text]);
  return (
    <Card title="🔐 Hash Generator">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to hash..." className="w-full h-20 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none mb-3" />
      {text && Object.entries(hashes).map(([algo, h]) => (
        <div key={algo} className="mb-3">
          <label className="text-xs uppercase font-medium text-gray-500">{algo}</label>
          <div className="flex gap-2"><input readOnly value={h} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg font-mono text-xs" /><button onClick={() => navigator.clipboard.writeText(h)} className="px-3 py-1 bg-gray-200 rounded text-xs">Copy</button></div>
        </div>
      ))}
    </Card>
  );
}

// ==== ROUTER ====
export default function ToolPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const tool = TOOLS[slug];

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">❌</p>
          <p className="text-gray-500 mb-4">Tool not found</p>
          <Link href="/tools" className="btn-primary inline-block">Back to Tools</Link>
        </div>
      </div>
    );
  }

  // Build JSON-LD schemas
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
    mainEntity: tool.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const render = () => {
    switch (tool.component) {
      case 'bmi': return <BMICalc />;
      case 'age': return <AgeCalc />;
      case 'percentage': return <PercentageCalc />;
      case 'emi': return <EMICalc />;
      case 'gst': return <GSTCalc />;
      case 'compound': return <CompoundCalc />;
      case 'date': return <DateDiff />;
      case 'gpa': return <GPACalc />;
      case 'tip': return <TipCalc />;
      case 'discount': return <DiscountCalc />;
      case 'timezone': return <TimezoneConverter />;
      case 'currency': return <CurrencyConverter />;
      case 'length': return <UnitConverter type="length" />;
      case 'weight': return <UnitConverter type="weight" />;
      case 'temperature': return <UnitConverter type="temperature" />;
      case 'speed': return <UnitConverter type="speed" />;
      case 'area': return <UnitConverter type="area" />;
      case 'numwords': return <NumberToWords />;
      case 'roman': return <RomanConverter />;
      case 'wordcount': return <WordCounter />;
      case 'textcase': return <TextCase />;
      case 'json': return <JsonFormatter />;
      case 'password': return <PasswordGen />;
      case 'uuid': return <UuidGen />;
      case 'markdown': return <MarkdownEditor />;
      case 'notepad': return <Notepad />;
      case 'qr': return <QRCodeGen />;
      case 'color': return <ColorPalette />;
      case 'base64': return <Base64Encoder />;
      case 'hash': return <HashGenerator />;
      default: return <Card title={tool.name}><p>{tool.desc}</p></Card>;
    }
  };

  return (
    <div>
      {render()}

      {/* In-content Ad */}
      <div className="max-w-3xl mx-auto px-4 my-8">
        <AdSlot slot="1234567891" format="auto" responsive={true} />
      </div>

      {/* FAQ Section */}
      {tool.faqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-display font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, i) => (
              <div key={i} className="card p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Data */}
      <Script id={`tool-schema-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id={`faq-schema-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="text-center py-8">
        <Link href="/tools" className="text-primary-600 hover:underline text-sm">← Back to All Tools</Link>
      </div>
    </div>
  );
}
