import { useState } from 'react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    quote:
      'Wake up where the hills meet the sea. Comfort for every traveler from budget to luxury at the top of Sitakund.',
    name: 'Babilik Ahmed',
    role: 'Designer, SEO Agency',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    quote:
      'An unforgettable experience. The views, the service, everything was perfect. We will definitely be back!',
    name: 'Sarun Ahmad',
    role: 'Travel Blogger',
    avatar: null,
  },
  {
    id: 3,
    quote:
      'The best resort we have stayed at. Family-friendly and the staff went above and beyond.',
    name: 'Maria Johnson',
    role: 'Family Traveler',
    avatar: null,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="testimonials">
      <div className="section-header">
        <span className="section-label">TESTIMONIAL</span>
        <h2 className="testimonial-title">What Our Satisfied Clients Have to Say!</h2>
        <h2 className="testimonial-title-mobile">Check our clients reviews!</h2>
      </div>
      <div className="testimonials-wrapper">
        <div className="testimonial-cards">
          {testimonials.map((t, i) => (
            <article
              key={t.id}
              className={`testimonial-card ${i === activeIndex ? 'active' : ''}`}
            >
              <span className="quote-icon">"</span>
              <p>{t.quote}</p>
              <div className="footer-divider" />
              <div className="testimonial-author">
                <div className="avatar">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} />
                  ) : (
                    <div className="avatar-placeholder"></div>
                  )}
                </div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="testimonial-pagination">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}