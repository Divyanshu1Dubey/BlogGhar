'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Download, Heart, Search, Grid, List } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HD Wallpapers - Free Download',
  description: 'Download stunning HD wallpapers for phone, tablet, and desktop. Free high-resolution backgrounds in Nature, City, Space, Abstract categories.',
  openGraph: { title: 'HD Wallpapers - Free Download', description: 'Free HD wallpapers for all devices.', type: 'website' },
};

const wallpapers = [
  { id: '1', title: 'Mountain Sunrise', category: 'Nature', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
  { id: '2', title: 'Ocean Waves', category: 'Nature', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800' },
  { id: '3', title: 'City Lights', category: 'City', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800' },
  { id: '4', title: 'Galaxy Stars', category: 'Space', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800' },
  { id: '5', title: 'Forest Path', category: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
  { id: '6', title: 'Minimal Abstract', category: 'Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800' },
  { id: '7', title: 'Sunset Beach', category: 'Nature', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { id: '8', title: 'Cyberpunk City', category: 'City', url: 'https://images.unsplash.com/photo-1575405142778-3892cf1705e2?w=800' },
];

export default function WallpapersPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(wallpapers.map(w => w.category))];
  const filtered = wallpapers.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">🖼️ HD Wallpapers</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Download stunning high-definition wallpapers for your phone, tablet, and desktop.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wallpapers..."
              className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex bg-gray-100 dark:bg-dark-card rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-dark-bg shadow-sm' : ''}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-dark-bg shadow-sm' : ''}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Wallpaper Grid */}
      {filtered.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
          {filtered.map((wallpaper) => (
            <div key={wallpaper.id} className={viewMode === 'grid' ? 'card overflow-hidden group' : 'card p-3 flex items-center gap-4'}>
              {viewMode === 'grid' ? (
                <>
                  <div className="relative aspect-[9/16] bg-gray-200">
                    <img src={wallpaper.url} alt={wallpaper.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                      {wallpaper.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm">{wallpaper.title}</h3>
                  </div>
                </>
              ) : (
                <>
                  <img src={wallpaper.url} alt={wallpaper.title} className="w-16 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium">{wallpaper.title}</h3>
                    <p className="text-sm text-gray-500">{wallpaper.category}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg">
                    <Download className="w-5 h-5 text-gray-500" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-gray-500">No wallpapers found</p>
        </div>
      )}
    </div>
  );
}
