import { useState, useEffect, useRef } from "react";
import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    quote:
      "Wake up where the hills meet the sea. Comfort for every traveler from budget to luxury at the top of Sitakund.",
    name: "Babilik Ahmed",
    role: "Designer, SEO Agency",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    quote:
      "An unforgettable experience. The views, the service, everything was perfect. We will definitely be back!",
    name: "Sarun Ahmad",
    role: "Travel Blogger",
    avatar: null,
  },
  {
    id: 3,
    quote:
      "The best resort we have stayed at. Family-friendly and the staff went above and beyond.",
    name: "Maria Johnson",
    role: "Family Traveler",
    avatar: null,
  },
];

function getCardStyle(offset) {
  const abs = Math.abs(offset);

  if (abs > 1) {
    return { opacity: 0, pointerEvents: "none", zIndex: 0 };
  }

  const scale = offset === 0 ? 1 : 0.78;
  const translateX = offset === 0 ? "0%" : offset < 0 ? "-100%" : "100%";
  const translateZ = offset === 0 ? "translateZ(60px)" : "translateZ(-30px)";
  const opacity = offset === 0 ? 1 : 0.7;
  const zIndex = offset === 0 ? 10 : 5;
  const filter = offset === 0 ? "none" : "blur(0.3px)";
  return {
    transform: `translateX(${translateX}) scale(${scale}) ${translateZ}`,
    opacity,
    zIndex,
    filter,
  };
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoRef = useRef(null);

  const advance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 750);
  };

  const goTo = (i) => {
    if (isTransitioning || i === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(i);
    setTimeout(() => setIsTransitioning(false), 750);
  };

  useEffect(() => {
    autoRef.current = setInterval(advance, 3800);
    return () => clearInterval(autoRef.current);
  }, [isTransitioning]);

  return (
    <section className="testimonials">
      <div className="section-header">
        <span className="section-label">Testimonial</span>
        <h2 className="testimonial-title">
          What Our Satisfied Clients Have to Say!
        </h2>
        <h2 className="testimonial-title-mobile">Check our client reviews!</h2>
      </div>

      <div className="testimonials-wrapper">
        <div className="testimonial-stage">
          {testimonials.map((t, i) => {
            let offset = i - activeIndex;
            const n = testimonials.length;
            if (offset > Math.floor(n / 2)) offset -= n;
            if (offset < -Math.floor(n / 2)) offset += n;

            const style = getCardStyle(offset);
            const isCenter = offset === 0;

            return (
              <article
                key={t.id}
                className={`testimonial-card${isCenter ? " is-center" : ""}`}
                style={style}
                onClick={() => goTo(i)}
                aria-label={
                  isCenter
                    ? "Current testimonial"
                    : `View testimonial by ${t.name}`
                }
              >
                <span className="quote-icon">"</span>
                <p>{t.quote}</p>
                <div className="footer-divider" />
                <div className="testimonial-author">
                  <div className="avatar">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} />
                    ) : (
                      <div className="avatar-placeholder" />
                    )}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="testimonial-pagination">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`dott${i === activeIndex ? " active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
