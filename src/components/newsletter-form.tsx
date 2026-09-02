'use client';

import { useState } from 'react';

export default function NewsletterForm({ variant = 'sidebar' }: { variant?: 'sidebar' | 'inline' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Subscribed! Check your inbox.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong.');
    }
  };

  const inputClass = variant === 'sidebar'
    ? 'w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-primary-200 text-sm focus:outline-none focus:ring-2 focus:ring-white'
    : 'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500';

  const buttonClass = variant === 'sidebar'
    ? 'w-full bg-white text-primary-700 py-2 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors'
    : 'btn-primary w-full';

  if (status === 'success') {
    return (
      <div className={`text-center ${variant === 'sidebar' ? 'text-white' : ''}`}>
        <p className="text-2xl mb-2">✅</p>
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className={inputClass}
      />
      <button type="submit" className={buttonClass} disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : variant === 'sidebar' ? 'Subscribe Free' : 'Subscribe'}
      </button>
      {status === 'error' && <p className="text-red-300 text-xs mt-2">{message}</p>}
    </form>
  );
}
