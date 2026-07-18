import { useState, useEffect, useRef } from "react";
import OptimizedImage from "./OptimizedImage";
import "./Testimonials.css";
import { supabase } from "../lib/supabaseClient";

/* Google rating badge — shows only when the rating is filled in the CMS
   (Admin → Home → Google rating fields, stored on pages.content) */
function GoogleRatingBadge() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("pages")
      .select("content")
      .eq("slug", "home")
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        const c = data?.content || {};
        const rating = Number(c.google_rating);
        if (rating > 0 && rating <= 5) {
          setInfo({
            rating,
            count: Number(c.google_review_count) || null,
            url: c.google_reviews_url || null,
          });
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!info) return null;

  const stars =
    "★".repeat(Math.round(info.rating)) +
    "☆".repeat(5 - Math.round(info.rating));

  const badge = (
    <span className="google-rating-badge">
      <strong>{info.rating.toFixed(1)}</strong>
      <span className="google-rating-stars" aria-hidden="true">
        {stars}
      </span>
      {info.count ? <span>({info.count} Google reviews)</span> : <span>on Google</span>}
    </span>
  );

  return info.url ? (
    <a
      className="google-rating-link"
      href={info.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {badge}
    </a>
  ) : (
    badge
  );
}

// testimonials are loaded from Supabase `testimonials` table
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
  const [testimonials, setTestimonials] = useState([]);
  const advance = () => {
    if (isTransitioning) return;
    if (!testimonials || testimonials.length === 0) return;
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
    if (!testimonials || testimonials.length === 0) return;
    const id = setInterval(() => {
      if (isTransitioning) return;
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsTransitioning(false), 750);
    }, 3800);
    return () => clearInterval(id);
  }, [testimonials.length, isTransitioning]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data, error } = await supabase.from("testimonials").select("*").order("id", { ascending: true });
        if (error) throw error;
        if (!mounted) return;
        const mapped = (data || []).map((r) => {
          const avatar = r.avatar;
          if (avatar && avatar.startsWith("http")) return r;
          try {
            const { data: urlData } = supabase.storage.from("images").getPublicUrl(avatar);
            return { ...r, avatar: (urlData && (urlData.publicUrl || urlData.public_url)) || avatar };
          } catch (e) {
            return r;
          }
        });
        setTestimonials(mapped);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="testimonials">
      <div className="section-header">
        <span className="section-label-t">Testimonial</span>
        <h2 className="testimonial-title">
          What Our Satisfied Clients Have to Say!
        </h2>
        <h2 className="testimonial-title-mobile">Check our client reviews!</h2>
        <GoogleRatingBadge />
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
                <span className="quote-icon" aria-hidden="true">
                  &ldquo;
                </span>
                <div className="testimonial-stars" aria-hidden="true">
                  ★★★★★
                </div>
                <p>{t.quote}</p>
                <div className="footer-divider" />
                <div className="testimonial-author">
                  <div className="avatar">
                    {t.avatar ? (
                      <OptimizedImage src={t.avatar} alt={t.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {(t.name || "G").trim().charAt(0).toUpperCase()}
                      </div>
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
