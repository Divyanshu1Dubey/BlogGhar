'use client';

import { useState } from 'react';

const signs = [
  { name: 'Aries', icon: '♈', date: 'Mar 21 - Apr 19', color: 'from-red-400 to-orange-400' },
  { name: 'Taurus', icon: '♉', date: 'Apr 20 - May 20', color: 'from-green-400 to-teal-400' },
  { name: 'Gemini', icon: '♊', date: 'May 21 - Jun 20', color: 'from-yellow-400 to-amber-400' },
  { name: 'Cancer', icon: '♋', date: 'Jun 21 - Jul 22', color: 'from-blue-400 to-indigo-400' },
  { name: 'Leo', icon: '♌', date: 'Jul 23 - Aug 22', color: 'from-orange-400 to-yellow-400' },
  { name: 'Virgo', icon: '♍', date: 'Aug 23 - Sep 22', color: 'from-green-400 to-emerald-400' },
  { name: 'Libra', icon: '♎', date: 'Sep 23 - Oct 22', color: 'from-pink-400 to-rose-400' },
  { name: 'Scorpio', icon: '♏', date: 'Oct 23 - Nov 21', color: 'from-purple-400 to-violet-400' },
  { name: 'Sagittarius', icon: '♐', date: 'Nov 22 - Dec 21', color: 'from-indigo-400 to-blue-400' },
  { name: 'Capricorn', icon: '♑', date: 'Dec 22 - Jan 19', color: 'from-gray-400 to-slate-400' },
  { name: 'Aquarius', icon: '♒', date: 'Jan 20 - Feb 18', color: 'from-cyan-400 to-sky-400' },
  { name: 'Pisces', icon: '♓', date: 'Feb 19 - Mar 20', color: 'from-blue-400 to-cyan-400' },
];

const horoscopes: Record<string, { love: string; career: string; health: string; lucky: { number: string; color: string; time: string } }> = {
  'Aries': { love: 'A magnetic energy surrounds you today, drawing meaningful connections. Be open to unexpected encounters.', career: 'Your initiative will pay off. Take charge of that project you have been putting off.', health: 'Channel your energy into physical activity. A morning workout will set a positive tone.', lucky: { number: '7', color: 'Red', time: '2:00 PM' } },
  'Taurus': { love: 'Stability and comfort are your themes. Enjoy quality time with loved ones.', career: 'Your practical approach will help you solve a lingering problem efficiently.', health: 'Indulge in some self-care. A relaxing massage or spa day would be wonderful.', lucky: { number: '6', color: 'Green', time: '8:00 AM' } },
  'Gemini': { love: 'Communication is key today. Express your feelings clearly and listen with an open heart.', career: 'Your versatility shines. You might juggle multiple projects successfully.', health: 'Stay hydrated and take regular breaks from screen time.', lucky: { number: '5', color: 'Yellow', time: '10:00 AM' } },
};

function getSignDetails(signName: string) {
  return {
    ...(horoscopes[signName] || { love: 'Today brings new opportunities. Stay positive and embrace the journey.', career: 'Focus on your goals. Your dedication will lead to success.', health: 'Take care of yourself. A balanced approach works best.', lucky: { number: Math.floor(Math.random() * 10).toString(), color: 'Blue', time: '3:00 PM' } }),
  };
}

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState(signs[0]);
  const [period, setPeriod] = useState('today');

  const details = getSignDetails(selectedSign.name);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-extrabold mb-3">🔮 Horoscope</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover what the stars have in store for you today</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center gap-2 mb-8">
        {['today', 'tomorrow', 'week', 'month'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${period === p ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-card'}`}>{p}</button>
        ))}
      </div>

      {/* Zodiac Signs Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {signs.map((sign) => (
            <button key={sign.name} onClick={() => setSelectedSign(sign)} className={`p-3 rounded-xl text-center transition-all ${selectedSign.name === sign.name ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'bg-white dark:bg-dark-card hover:bg-gray-50'}`}>
              <p className="text-2xl">{sign.icon}</p>
              <p className="text-xs font-medium mt-1">{sign.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Horoscope */}
      <div className={`bg-gradient-to-br ${selectedSign.color} rounded-2xl p-8 text-white mb-8`}>
        <div className="text-center mb-6">
          <span className="text-6xl">{selectedSign.icon}</span>
          <h2 className="text-3xl font-display font-extrabold mt-3">{selectedSign.name}</h2>
          <p className="text-white/80">{selectedSign.date}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
            <h3 className="font-bold text-lg mb-2">❤️ Love</h3>
            <p className="text-white/90 text-sm leading-relaxed">{details.love}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
            <h3 className="font-bold text-lg mb-2">💼 Career</h3>
            <p className="text-white/90 text-sm leading-relaxed">{details.career}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur">
            <h3 className="font-bold text-lg mb-2">🏥 Health</h3>
            <p className="text-white/90 text-sm leading-relaxed">{details.health}</p>
          </div>
        </div>
      </div>

      {/* Lucky Elements */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-5 text-center">
          <p className="text-xs text-gray-500 uppercase">Lucky Number</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{details.lucky.number}</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-xs text-gray-500 uppercase">Lucky Color</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-2xl">🎨</span>
            <span className="font-bold">{details.lucky.color}</span>
          </div>
        </div>
        <div className="card p-5 text-center">
          <p className="text-xs text-gray-500 uppercase">Lucky Time</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{details.lucky.time}</p>
        </div>
      </div>
    </div>
  );
}
