'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Save, User, AtSign, FileText } from 'lucide-react';

type Props = {
  initialUser: {
    id: string;
    name: string | null;
    email: string | null;
    bio: string | null;
    username: string | null;
  };
};

export default function ProfileSettingsForm({ initialUser }: Props) {
  const { data: session, update } = useSession();
  const [name, setName] = useState(initialUser.name || '');
  const [username, setUsername] = useState(initialUser.username || '');
  const [bio, setBio] = useState(initialUser.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username: username || null, bio: bio || null }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update session
        await update({ name: data.name, username: data.username, bio: data.bio });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            <User className="w-4 h-4 text-gray-400" /> Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="Your display name"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            <AtSign className="w-4 h-4 text-gray-400" /> Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="your-username"
          />
          <p className="text-xs text-gray-400 mt-1">Used for your public profile URL: /writers/your-username</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4 text-gray-400" /> Bio
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            maxLength={300}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-y"
            placeholder="Tell readers about yourself..."
          />
          <p className="text-xs text-gray-400 mt-1">{bio.length}/300 characters</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {message?.type === 'success' && (
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Changes saved!</span>
        )}
      </div>
    </form>
  );
}
