'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError('Invalid email or password');
      } else if (res?.ok) {
        const session = await getSession();
        const role = (session?.user as { role?: string } | undefined)?.role;
        window.location.href = role === 'ADMIN' ? '/admin' : '/';
      } else {
        setError('Unable to sign in. Please try again.');
      }
    } catch {
      setError('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-display font-extrabold text-primary-600">🌿 Blog-Ghar</Link>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary-600 font-medium hover:underline">Sign up</Link>
          </p>
          <p className="text-gray-400 mt-2">
            <Link href="/forgot-password" className="hover:text-primary-600">Forgot password?</Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
          <p className="text-xs text-center text-gray-400">Or continue with</p>
          <div className="flex gap-3 mt-3">
            <button onClick={() => signIn('google')} className="flex-1 py-2 border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-bg">Google</button>
            <button onClick={() => signIn('github')} className="flex-1 py-2 border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-bg">GitHub</button>
          </div>
        </div>
      </div>
    </div>
  );
}
