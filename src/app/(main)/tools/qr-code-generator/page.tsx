'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate free QR codes online. Create custom QR codes for URLs, text, phone numbers and more.',
  openGraph: { title: 'QR Code Generator', description: 'Generate free QR codes online.', type: 'website' },
};

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState('');

  const generateQR = () => {
    if (!text) return;
    const encoded = encodeURIComponent(text);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`);
  };

  useEffect(() => {
    if (text) generateQR();
  }, [size]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-extrabold mb-2">📱 QR Code Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate QR codes for URLs, text, and more.</p>
      </div>

      <div className="card p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Enter text or URL</label>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); generateQR(); }}
            placeholder="https://example.com or any text..."
            className="w-full h-24 px-3 py-2 border rounded-lg dark:bg-dark-bg resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Size: {size}px</label>
          <input type="range" min="128" max="512" step="64" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
        </div>

        {qrUrl && (
          <div className="text-center p-6 bg-gray-50 dark:bg-dark-bg rounded-xl">
            <img src={qrUrl} alt="QR Code" className="mx-auto mb-4" style={{ maxWidth: size + 40 }} />
            <a href={qrUrl} download="qrcode.png" className="btn-primary inline-block">Download QR Code</a>
          </div>
        )}
      </div>
    </div>
  );
}
