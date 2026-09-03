'use client';
import { useEffect, useState } from 'react';

const defaults = { siteName: 'Blog-Ghar', siteDescription: 'Your one-stop destination for blogs, games, news, tools & more.', adminEmail: '', metaTitle: '', metaDescription: '', adsensePublisherId: '' };
export default function SettingsForm() {
  const [values, setValues] = useState(defaults);
  const [message, setMessage] = useState('');
  useEffect(() => { fetch('/api/admin/settings').then(async (r) => { if (!r.ok) throw new Error((await r.json()).error); return r.json(); }).then((v) => setValues((x) => ({ ...x, ...v }))).catch((e) => setMessage(e.message)); }, []);
  const update = (key: keyof typeof defaults, value: string) => setValues((v) => ({ ...v, [key]: value }));
  async function save(e: React.FormEvent) { e.preventDefault(); setMessage(''); const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }); const data = await r.json(); setMessage(r.ok ? 'Settings saved.' : data.error || 'Unable to save settings.'); }
  return <form onSubmit={save} className="grid max-w-2xl gap-6">{[['General Settings', ['siteName', 'siteDescription', 'adminEmail']], ['SEO Settings', ['metaTitle', 'metaDescription']], ['AdSense', ['adsensePublisherId']]].map(([heading, keys]) => <section key={heading as string} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-dark-border dark:bg-dark-card"><h2 className="mb-4 font-bold text-lg">{heading as string}</h2>{(keys as string[]).map((key) => <label key={key} className="mb-4 block text-sm font-medium">{key.replace(/[A-Z]/g, (m) => ` ${m}`).replace(/^./, (m) => m.toUpperCase())}<input value={values[key as keyof typeof defaults]} onChange={(e) => update(key as keyof typeof defaults, e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-dark-border dark:bg-dark-bg" /></label>)}</section>)}<button className="w-fit rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white">Save settings</button>{message && <p className="text-sm text-gray-600">{message}</p>}</form>;
}
