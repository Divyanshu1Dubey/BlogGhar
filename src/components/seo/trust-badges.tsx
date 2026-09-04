'use client';

const trustItems = [
  { icon: '🔒', label: 'Secure & Private', desc: 'No signup required' },
  { icon: '🚀', label: 'Lightning Fast', desc: 'Instant play experience' },
  { icon: '📱', label: 'Mobile Friendly', desc: 'Play on any device' },
  { icon: '🎯', label: 'Ad-Supported Free', desc: 'Always 100% free' },
  { icon: '✅', label: 'Trusted by Users', desc: 'Millions of visits' },
  { icon: '⭐', label: 'Top Rated', desc: 'Best entertainment site' },
];

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {trustItems.slice(0, 4).map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {trustItems.map((item) => (
        <div key={item.label} className="flex flex-col items-center text-center p-3 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
          <span className="text-2xl mb-1.5">{item.icon}</span>
          <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{item.label}</span>
          <span className="text-[10px] text-gray-500 mt-0.5">{item.desc}</span>
        </div>
      ))}
    </div>
  );
}
