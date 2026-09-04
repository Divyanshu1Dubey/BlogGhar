'use client';

import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    role: 'College Student',
    avatar: 'RS',
    text: 'Blog-Ghar is my go-to site for quick learning and gaming breaks! The articles are well-written and the games are super addictive.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Software Developer',
    avatar: 'PP',
    text: 'Love the tech articles! Very informative and easy to understand. The tools section is a bonus — I use the BMI and EMI calculators regularly.',
    rating: 5,
  },
  {
    name: 'Amit Kumar',
    role: 'Business Owner',
    avatar: 'AK',
    text: 'Great content on business and finance. The blog posts are comprehensive and actually useful for real-world decisions.',
    rating: 5,
  },
  {
    name: 'Sneha Reddy',
    role: 'Teacher',
    avatar: 'SR',
    text: 'I use Blog-Ghar for my students. The educational content is well-researched and the quizzes make learning fun!',
    rating: 4,
  },
  {
    name: 'Vikram Singh',
    role: 'Gaming Enthusiast',
    avatar: 'VS',
    text: '52+ games and still adding more! The multiplayer mode is awesome. Love competing with friends on the leaderboards.',
    rating: 5,
  },
  {
    name: 'Anita Joshi',
    role: 'Homemaker',
    avatar: 'AJ',
    text: 'The recipes and lifestyle articles are so helpful. I check the site every day for new content. Beautiful website too!',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white mb-3">
          What Our Readers Say
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Join thousands of happy readers who love Blog-Ghar for quality content, fun games, and useful tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card p-6 hover:shadow-lg transition-all">
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed italic">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</h4>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
