'use client';
import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toasts: Toast[] = [];
let listeners: (() => void)[] = [];
const addToast = (toast: Omit<Toast, 'id'>) => {
  const newToast = { ...toast, id: Math.random().toString(36) };
  toasts.push(newToast);
  listeners.forEach(l => l());
  setTimeout(() => { toasts = toasts.filter(t => t.id !== newToast.id); listeners.forEach(l => l()); }, 4000);
};

export function useToast() {
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);
  return { toast: { success: (m: string) => addToast({ message: m, type: 'success' }), error: (m: string) => addToast({ message: m, type: 'error' }), info: (m: string) => addToast({ message: m, type: 'info' }) } };
}

export function Toaster() {
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm min-w-[300px] ${t.type === 'success' ? 'bg-green-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'}`}>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => { toasts = toasts.filter(x => x.id !== t.id); forceUpdate({}); }} className="opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
}
