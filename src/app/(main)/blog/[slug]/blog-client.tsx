'use client';

import { useState } from 'react';

export default function BlogClient({ content }: { content: string; excerpt?: string }) {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div
        className={showFull ? '' : 'line-clamp-3'}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {!showFull && (
        <button
          onClick={() => setShowFull(true)}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-2"
        >
          Read more →
        </button>
      )}
    </div>
  );
}
