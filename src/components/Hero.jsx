import "./Hero.css";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Hero() {
  const [heroImage, setHeroImage] = useState(null);

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
        .select("hero_image, hero_heading, hero_subtext")
        .eq("slug", "home")
        .maybeSingle();

      if (error) {
        console.error("Hero fetch error:", error.message || error);
        return;
      }

      if (!mounted || !data) return;

      const normalize = (val) =>
        val ? String(val).replace(/\\n|\/n/g, "\n") : val;

      const resolveImage = async (img) => {
        if (!img) return null;
        if (img.startsWith("http")) return img;

        const { data } = supabase.storage.from("images").getPublicUrl(img);

        return data?.publicUrl || img;
      };

      const [imageUrl] = await Promise.all([resolveImage(data.hero_image)]);

      if (!mounted) return;

      if (imageUrl) {
        // preload to avoid flash
        try {
          await new Promise((res, rej) => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => res(true);
            img.onerror = rej;
          });
          setHeroImage(imageUrl);
          setImageLoaded(true);
        } catch (e) {
          // still set the url and continue
          setHeroImage(imageUrl);
        }
      }

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
        {loading ? (
          <>
            <div className="hero-image">
              <div className="skeleton skeleton-image" />
            </div>
            <div className="hero-content">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-sub" />
            </div>
          </>
        ) : (
          <>
            <div className="hero-image">
              <img
                src={heroImage}
                alt={heading || "Hero image"}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={imageLoaded ? "loaded" : ""}
              />
            </div>

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
          </>
        )}
      </section>
    </div>
  );
}
