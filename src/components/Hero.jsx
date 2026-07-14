import "./Hero.css";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import heroBg from "../assets/hero-bg.jpg";
import heroBgWide from "../assets/hero-bg-wide.jpg";

export default function Hero() {
  const [heading, setHeading] = useState(null);
  const [subtext, setSubtext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadHero = async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("hero_heading, hero_subtext")
        .eq("slug", "home")
        .maybeSingle();

      if (error) {
        console.error("Hero fetch error:", error.message || error);
        return;
      }

      if (!mounted || !data) return;

      const normalize = (val) =>
        val ? String(val).replace(/\\n|\/n/g, "\n") : val;

      if (data.hero_heading) setHeading(normalize(data.hero_heading));

      if (data.hero_subtext) setSubtext(normalize(data.hero_subtext));

      setLoading(false);
    };

    loadHero();

    return () => {
      mounted = false;
    };
  }, []);

  // Ensure animation class is added when skeleton unmounts and content mounts
  useEffect(() => {
    if (!loading && imageLoaded) {
      // wait for DOM to update then add class
      requestAnimationFrame(() => {
        contentRef.current?.classList.add("in-view");
      });
    }
  }, [loading, imageLoaded]);

  return (
    <div className="hero-wrapper">
      <section className="hero" id="home">
        <div className="hero-image">
          <picture>
            {/* Phones get the 3:2 picture; wider screens get the banner */}
            <source media="(max-width: 768px)" srcSet={heroBg} />
            <img
              src={heroBgWide}
              alt={heading || "Hotel The Grand Alayna"}
              onLoad={() => setImageLoaded(true)}
              className={imageLoaded ? "loaded" : ""}
            />
          </picture>
        </div>

        {loading ? (
          <div className="hero-content">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-sub" />
          </div>
        ) : (
          <div ref={contentRef} className="hero-content scroll-animate">
            <h1>
              {String(heading || "")
                .split("\n")
                .map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
            </h1>

            <p>
              <span className="hero-accent"></span>
              {String(subtext || "")
                .split("\n")
                .map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
