import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type HoroscopeParams = Promise<{ sign: string }>;

interface Props {
  params: HoroscopeParams;
}

export async function generateMetadata({ params }: { params: HoroscopeParams }): Promise<Metadata> {
  try {
    const { sign } = await params;
    const signName = decodeURIComponent(sign);
    return {
      title: `${signName} Horoscope - Daily, Weekly & Monthly`,
      description: `Get your free ${signName} horoscope. Daily, weekly, and monthly predictions for love, career, and health.`,
      openGraph: { title: `${signName} Horoscope`, description: `Free ${signName} horoscope predictions.`, type: 'website' },
    };
  } catch { return {}; }
}

export default async function HoroscopeSignPage({ params }: Props) {
  const { sign } = await params;
  const signLower = sign.toLowerCase();

  const validSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  if (!validSigns.includes(sign)) {
    notFound();
  }

  const horoscopeData: Record<string, any> = {
    aries: { icon: '♈', name: 'Aries', element: 'Fire', dates: 'Mar 21 - Apr 19', ruling: 'Mars', strengths: 'Courageous, determined, confident', weaknesses: 'Impatient, moody, impulsive', love: 'Passionate encounters await. Be bold in expressing your feelings.', career: 'Leadership opportunities emerge. Take charge of projects.', health: 'High energy days ahead. Channel into physical activities.' },
    taurus: { icon: '♉', name: 'Taurus', element: 'Earth', dates: 'Apr 20 - May 20', ruling: 'Venus', strengths: 'Reliable, patient, practical', weaknesses: 'Stubborn, possessive, uncompromising', love: 'Stability brings joy. Nurture existing connections.', career: 'Financial gains possible. Your persistence pays off.', health: 'Focus on comfort and wellness. Good time for self-care.' },
    gemini: { icon: '♊', name: 'Gemini', element: 'Air', dates: 'May 21 - Jun 20', ruling: 'Mercury', strengths: 'Adaptable, outgoing, curious', weaknesses: 'Inconsistent, nervous, indecisive', love: 'Interesting conversations lead to connections.', career: 'Communication skills shine. Write, present, network.', health: 'Mental stimulation is key. Keep learning!' },
    cancer: { icon: '♋', name: 'Cancer', element: 'Water', dates: 'Jun 21 - Jul 22', ruling: 'Moon', strengths: 'Intuitive, caring, protective', weaknesses: 'Moody, oversensitive, clingy', love: 'Deep emotional connections form. Trust your feelings.', career: 'Support from colleagues helps. Work in teams.', health: 'Emotional wellbeing matters. Practice self-compassion.' },
    leo: { icon: '♌', name: 'Leo', element: 'Fire', dates: 'Jul 23 - Aug 22', ruling: 'Sun', strengths: 'Creative, confident, generous', weaknesses: 'Arrogant, stubborn, self-centered', love: 'You radiate charm. Romance is in the air!', career: 'Recognition and praise coming. Showcase your work.', health: 'Heart and back need attention. Stay active.' },
    virgo: { icon: '♍', name: 'Virgo', element: 'Earth', dates: 'Aug 23 - Sep 22', ruling: 'Mercury', strengths: 'Analytical, practical, diligent', weaknesses: 'Critical, overthinking, perfectionist', love: 'Small gestures create big moments. Be thoughtful.', career: 'Details matter. Your precision leads to success.', health: 'Digestive health important. Eat well, stay hydrated.' },
    libra: { icon: '♎', name: 'Libra', element: 'Air', dates: 'Sep 23 - Oct 22', ruling: 'Venus', strengths: 'Diplomatic, fair-minded, social', weaknesses: 'Avoids conflict, holds grudges, self-pity', love: 'Harmony in relationships. Balance give and take.', career: 'Partnerships flourish. Collaborate for success.', health: 'Balance exercise and rest. Avoid over-exertion.' },
    scorpio: { icon: '♏', name: 'Scorpio', element: 'Water', dates: 'Oct 23 - Nov 21', ruling: 'Pluto', strengths: 'Passionate, resourceful, brave', weaknesses: 'Jealous, secretive, resentful', love: 'Intense connections deepen. Trust the process.', career: 'Power dynamics shift. Stay strategic.', health: 'Transform your routines. Detox and renew.' },
    sagittarius: { icon: '♐', name: 'Sagittarius', element: 'Fire', dates: 'Nov 22 - Dec 21', ruling: 'Jupiter', strengths: 'Optimistic, adventurous, generous', weaknesses: 'Tactless, restless, impatient', love: 'New adventures in love. Keep an open mind.', career: 'Growth opportunities arise. Think big picture.', health: 'Stay active and outdoors. Refresh your spirit.' },
    capricorn: { icon: '♑', name: 'Capricorn', element: 'Earth', dates: 'Dec 22 - Jan 19', ruling: 'Saturn', strengths: 'Disciplined, responsible, ambitious', weaknesses: 'Pessimistic, controlling, rigid', love: 'Commitment deepens. Build lasting bonds.', career: 'Hard work recognized. Promotion possible.', health: 'Bones and joints need care. Stay disciplined with wellness.' },
    aquarius: { icon: '♒', name: 'Aquarius', element: 'Air', dates: 'Jan 20 - Feb 18', ruling: 'Uranus', strengths: 'Innovative, independent, humanitarian', weaknesses: 'Rebellious, aloof, unpredictable', love: 'Unconventional connections. Embrace uniqueness.', career: 'Creative solutions praised. Innovate!', health: 'Circulation and nerves need attention. Stay grounded.' },
    pisces: { icon: '♓', name: 'Pisces', element: 'Water', dates: 'Feb 19 - Mar 20', ruling: 'Neptune', strengths: 'Compassionate, artistic, intuitive', weaknesses: 'Escapist, oversensitive, codependent', love: 'Dreamy romance. Let your heart lead.', career: 'Creativity at its peak. Trust your vision.', health: 'Immune system needs care. Rest and hydrate.' },
  };

  const data = horoscopeData[sign];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <span className="text-7xl block mb-4">{data.icon}</span>
        <h1 className="text-4xl font-display font-extrabold">{data.name} Horoscope</h1>
        <p className="text-gray-500 mt-2">{data.dates} • {data.element} Sign • Ruled by {data.ruling}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">💕 Love & Relationships</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.love}</p>
        </div>
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">💼 Career & Finance</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.career}</p>
        </div>
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">🏥 Health & Wellness</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.health}</p>
        </div>
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">⭐ About {data.name}</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Strengths:</span> {data.strengths}</p>
            <p><span className="font-medium">Weaknesses:</span> {data.weaknesses}</p>
            <p><span className="font-medium">Element:</span> {data.element}</p>
            <p><span className="font-medium">Ruling Planet:</span> {data.ruling}</p>
          </div>
        </div>
      </div>

      {/* Daily Lucky */}
      <div className="card p-6 mt-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <h3 className="font-display font-bold text-lg mb-3">🍀 Today&apos;s Luck</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">7</p>
            <p className="text-sm text-primary-100">Lucky Number</p>
          </div>
          <div>
            <p className="text-3xl font-bold">Red</p>
            <p className="text-sm text-primary-100">Lucky Color</p>
          </div>
          <div>
            <p className="text-3xl font-bold">Tue</p>
            <p className="text-sm text-primary-100">Lucky Day</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { sign } = await params;
  const data: Record<string, any> = {
    aries: { name: 'Aries', icon: '♈' }, taurus: { name: 'Taurus', icon: '♉' }, gemini: { name: 'Gemini', icon: '♊' },
    cancer: { name: 'Cancer', icon: '♋' }, leo: { name: 'Leo', icon: '♌' }, virgo: { name: 'Virgo', icon: '♍' },
    libra: { name: 'Libra', icon: '♎' }, scorpio: { name: 'Scorpio', icon: '♏' }, sagittarius: { name: 'Sagittarius', icon: '♐' },
    capricorn: { name: 'Capricorn', icon: '♑' }, aquarius: { name: 'Aquarius', icon: '♒' }, pisces: { name: 'Pisces', icon: '♓' },
  };
  const d = data[sign.toLowerCase()];
  if (!d) return {};
  return { title: `${d.icon} ${d.name} Daily Horoscope | Blog-Ghar`, description: `Get your daily ${d.name} horoscope reading. Love, career, health predictions.` };
}
