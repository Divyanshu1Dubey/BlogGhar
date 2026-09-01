'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

// ==== TOOL DEFINITIONS ====
const TOOLS: Record<string, { name: string; icon: string; desc: string; component: 'bmi' | 'age' | 'percentage' | 'emi' | 'gst' | 'compound' | 'date' | 'gpa' | 'tip' | 'discount' | 'timezone' | 'currency' | 'length' | 'weight' | 'temperature' | 'speed' | 'area' | 'numwords' | 'roman' | 'wordcount' | 'textcase' | 'json' | 'password' | 'uuid' | 'markdown' | 'notepad' | 'qr' | 'color' | 'base64' | 'hash' }> = {
  'bmi-calculator': { name: 'BMI Calculator', icon: '⚖️', desc: 'Calculate your Body Mass Index', component: 'bmi' },
  'age-calculator': { name: 'Age Calculator', icon: '🎂', desc: 'Calculate exact age from your date of birth', component: 'age' },
  'percentage-calculator': { name: 'Percentage Calculator', icon: '%', desc: 'Calculate percentages easily', component: 'percentage' },
  'emi-calculator': { name: 'EMI Calculator', icon: '🏦', desc: 'Calculate loan EMI and interest', component: 'emi' },
  'gst-calculator': { name: 'GST Calculator', icon: '🧮', desc: 'Calculate GST tax amounts', component: 'gst' },
  'compound-interest': { name: 'Compound Interest', icon: '📈', desc: 'Calculate compound interest', component: 'compound' },
  'date-difference': { name: 'Date Difference', icon: '📅', desc: 'Days between two dates', component: 'date' },
  'gpa-calculator': { name: 'GPA Calculator', icon: '🎓', desc: 'Calculate your GPA', component: 'gpa' },
  'tip-calculator': { name: 'Tip Calculator', icon: '💵', desc: 'Calculate tip and split bill', component: 'tip' },
  'discount-calculator': { name: 'Discount Calculator', icon: '🏷️', desc: 'Calculate discounted price', component: 'discount' },
  'timezone-converter': { name: 'Time Zone Converter', icon: '🌍', desc: 'Convert time between zones', component: 'timezone' },
  'currency-converter': { name: 'Currency Converter', icon: '💱', desc: 'Convert world currencies', component: 'currency' },
  'length-converter': { name: 'Length Converter', icon: '📏', desc: 'Convert length units', component: 'length' },
  'weight-converter': { name: 'Weight Converter', icon: '⚖️', desc: 'Convert weight units', component: 'weight' },
  'temperature-converter': { name: 'Temperature Converter', icon: '🌡️', desc: 'Convert temperature units', component: 'temperature' },
  'speed-converter': { name: 'Speed Converter', icon: '🏎️', desc: 'Convert speed units', component: 'speed' },
  'area-converter': { name: 'Area Converter', icon: '📐', desc: 'Convert area units', component: 'area' },
  'number-to-words': { name: 'Number to Words', icon: '🔢', desc: 'Convert numbers to words', component: 'numwords' },
  'roman-numeral': { name: 'Roman Numeral Converter', icon: '🏛️', desc: 'Convert to/from Roman numerals', component: 'roman' },
  'word-counter': { name: 'Word Counter', icon: '📝', desc: 'Count words, characters, sentences', component: 'wordcount' },
  'text-case-converter': { name: 'Text Case Converter', icon: 'Aa', desc: 'Convert text case styles', component: 'textcase' },
  'json-formatter': { name: 'JSON Formatter', icon: '{ }', desc: 'Format and validate JSON', component: 'json' },
  'password-generator': { name: 'Password Generator', icon: '🔒', desc: 'Generate secure passwords', component: 'password' },
  'uuid-generator': { name: 'UUID Generator', icon: '🔑', desc: 'Generate UUIDs', component: 'uuid' },
  'markdown-editor': { name: 'Markdown Editor', icon: '📋', desc: 'Write and preview markdown', component: 'markdown' },
  'online-notepad': { name: 'Online Notepad', icon: '📒', desc: 'Quick online notepad', component: 'notepad' },
  'qr-code-generator': { name: 'QR Code Generator', icon: '📱', desc: 'Generate QR codes', component: 'qr' },
  'color-palette': { name: 'Color Palette Generator', icon: '🎨', desc: 'Generate color palettes', component: 'color' },
  'base64-encoder': { name: 'Base64 Encoder/Decoder', icon: '🔤', desc: 'Encode/decode Base64', component: 'base64' },
  'hash-generator': { name: 'Hash Generator', icon: '🔐', desc: 'Generate MD5/SHA hashes', component: 'hash' },
};

// ==== SHARED UI ====
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">{title}</h1>
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
  const now = new Date();
  const b = new Date(birth);
  let years = now.getFullYear() - b.getFullYear();
  let months = now.getMonth() - b.getMonth();
  let days = now.getDate() - b.getDate();
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
  const [p, setP] = useState; const [r, setR] = useState(9); const [t, setT] = useState(5);
  const n = t * 12, ri = r / 12 / 100;
  const emi = +(p * ri * Math.pow(1 + ri, n) / (Math.pow(1 + ri, n) - 1)).toFixed(2);
  const total = +(emi * n).toFixed(2);
  const interest = +(total - p).toFixed(2);
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
  const [amount, setAmount] = useState; const [rate, setRate] = useState(18);
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
  const [p, setP] = useState; const [r, setR] = useState(8); const [t, setT] = useState(10); const [n, setN] = useState(12);
  const amt = +(p * Math.pow(1 + r / 100 / n, n * t)).toFixed(2);
  const ci = +(amt - p).toFixed(2);
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
  const [bill, setBill] = useState; const [tip, setTip] = useState(15); const [people, setPeople] = useState(2);
  const tipAmt = +(bill * tip / 100).toFixed(2);
  const total = +(bill + tipAmt).toFixed(2);
  const perPerson = +(total / people).toFixed(2);
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
  const [price, setPrice] = useState; const [discount, setDiscount] = useState(25);
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
  const [tz, setTz] = useState('Asia/Kolkata');
  const [time, setTime] = useState(new Date().toISOString().slice(0, 16));
  const result = useMemo(() => {
    try {
      return new Date(time).toLocaleString('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'short' });
    } catch { return 'Invalid'; }
  }, [tz, time]);
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
  // Static exchange rates (in production, fetch from API)
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
  const [n, setN] = useState;
  const numWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const convert = (num: number): string => {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
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
  const [n, setN] = useState;
  const roman = (num: number): string => {
    const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let r = '';
    for (const [v, s] of map) { while (num >= v) { r += s; num -= v; } }
    return r;
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
        {[
          ['UPPERCASE', t.toUpperCase()], ['lowercase', t.toLowerCase()], ['Title Case', t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())],
          ['Sentence case', t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()], ['camelCase', t.replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase())], ['snake_case', t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_')], ['kebab-case', t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')],
        ].map(([label, val]) => (
          <div key={label as string} className="flex items-center gap-2"><span className="w-24 text-sm font-medium text-gray-500">{label}</span><input readOnly value={val as string} className="flex-1 px-3 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg text-sm" /><button onClick={() => navigator.clipboard.writeText(val as string)} className="px-2 py-1 text-xs bg-gray-200 dark:bg-dark-border rounded">Copy</button></div>
        ))}
      </div>
    </Card>
  );
}

function JsonFormatter() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [error, setError] = useState('');
  const format = () => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setError(''); }
    catch (e: any) { setError(e.message); setOutput(''); }
  };
  return (
    <Card title='{ } JSON Formatter'>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key":"value"}' className="h-64 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none font-mono text-sm" />
        <textarea readOnly value={output} placeholder="Formatted JSON..." className="h-64 px-3 py-2 border rounded-lg dark:bg-dark-bg bg-gray-50 dark:bg-dark-card resize-none font-mono text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={format} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Format</button>
        <button onClick={() => setOutput(JSON.stringify(JSON.parse(input))) } className="px-4 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg">Minify</button>
        {error && <p className="text-red-500 text-sm py-2 ml-3">{error}</p>}
      </div>
    </Card>
  );
}

function PasswordGen() {
  const [len, setLen] = useState(16); const [opts, setOpts] = useState({ u: true, l: true, n: true, s: true });
  const [pwd, setPwd] = useState('');
  const generate = () => {
    let pool = '';
    if (opts.u) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.l) pool += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.n) pool += '0123456789';
    if (opts.s) pool += '!@#$%^&*()_+-=[]{}';
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
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
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
  const html = useMemo(() => {
    return md.replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>').replace(/`(.*?)`/g, '<code>$1</code>');
  }, [md]);
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
  const generate = () => {
    const base = Math.floor(Math.random() * 360);
    setColors(Array.from({ length: 5 }, (_, i) => `hsl(${(base + i * 30) % 360}, 70%, 50%)`));
  };
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
  const result = useMemo(() => {
    try { return mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))); }
    catch { return 'Invalid input'; }
  }, [input, mode]);
  return (
    <Card title="🔤 Base64 Encoder/Decoder">
      <div className="flex gap-2 mb-3">
        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'encode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-lg font-medium ${mode === 'decode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg'}`}>Decode</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode' : 'Base64 to decode'} className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none mb-3" />
      <textarea readOnly value={result} placeholder="Result" className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-dark-bg bg-gray-50 dark:bg-dark-card resize-none" />
    </Card>
  );
}

function HashGenerator() {
  const [text, setText] = useState('');
  const hash = (algo: string) => {
    // Browser-side hash using SubtleCrypto for SHA; placeholder for MD5
    if (algo === 'MD5') return '(Use server-side for MD5)';
    // Async hash handled below
    return '';
  };
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });
  useEffect(() => {
    if (!text) { setHashes({ sha1: '', sha256: '', sha512: '' }); return; }
    (async () => {
      const enc = new TextEncoder().encode(text);
      const results: any = {};
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

  if (!tool) return <div className="max-w-3xl mx-auto px-4 py-8"><div className="card p-8 text-center"><p className="text-4xl mb-3">❌</p><p className="text-gray-500 mb-4">Tool not found</p><Link href="/tools" className="btn-primary inline-block">Back to Tools</Link></div></div>;

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
      <div className="text-center py-8">
        <Link href="/tools" className="text-primary-600 hover:underline text-sm">← Back to All Tools</Link>
      </div>
    </div>
  );
}
