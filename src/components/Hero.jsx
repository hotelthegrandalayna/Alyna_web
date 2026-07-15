import "./Hero.css";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import heroBgFallback from "../assets/hero-bg.jpg";
import heroBgWideFallback from "../assets/hero-bg-wide.jpg";

// Shown when the CMS has no taglines yet (Admin → Home → Animated taglines)
const DEFAULT_TAGLINES = [
  "Sea, hills & waterfalls at your doorstep",
  "Wake up to birdsong in the heart of Sitakund",
  "Adventure by day, comfort by night",
];

/* Luxury fade: the line appears with letters gently spread apart,
   then they settle together into focus; holds, then softly fades out */
function AnimatedTagline({ phrases }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const phrase = phrases[index % phrases.length];

  // hold long enough to read; a little longer for longer phrases
  useEffect(() => {
    if (reduced.current || phrases.length <= 1) return undefined;
    const hold = 3000 + phrase.length * 45;
    const timer = setTimeout(() => setLeaving(true), hold);
    return () => clearTimeout(timer);
  }, [index, phrases.length, phrase.length]);

  // once the exit animation finishes, bring in the next phrase
  useEffect(() => {
    if (!leaving) return undefined;
    const timer = setTimeout(() => {
      setLeaving(false);
      setIndex((i) => (i + 1) % phrases.length);
    }, 900);
    return () => clearTimeout(timer);
  }, [leaving, phrases.length]);

  if (!phrases.length) return null;
  if (reduced.current) {
    return <span className="tagline-phrase">{phrases[0]}</span>;
  }

  return (
    <span key={index} className={`tagline-phrase ${leaving ? "leaving" : ""}`}>
      {phrase}
    </span>
  );
}

export default function Hero() {
  const [heroWide, setHeroWide] = useState(null);
  const [heroMobile, setHeroMobile] = useState(null);
  const [heading, setHeading] = useState(null);
  const [subtext, setSubtext] = useState(null);
  const [taglines, setTaglines] = useState(DEFAULT_TAGLINES);
  const [taglineColor, setTaglineColor] = useState(null);
  const [taglineSize, setTaglineSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  // "W / H" of whichever image is showing; the band takes this exact shape
  const [ratio, setRatio] = useState(null);

  const contentRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadHero = async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("hero_image, hero_heading, hero_subtext, content")
        .eq("slug", "home")
        .maybeSingle();

      if (error) {
        console.error("Hero fetch error:", error.message || error);
        // fall back to bundled images so the hero still renders
        if (mounted) setLoading(false);
        return;
      }

      if (!mounted) return;
      if (!data) {
        setLoading(false);
        return;
      }

      const normalize = (val) =>
        val ? String(val).replace(/\\n|\/n/g, "\n") : val;

      const resolveImage = (img) => {
        if (!img) return null;
        if (img.startsWith("http")) return img;
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(img);
        return urlData?.publicUrl || img;
      };

      setHeroWide(resolveImage(data.hero_image));
      setHeroMobile(resolveImage(data.content?.hero_image_mobile));

      // CMS taglines: one phrase per line
      const rawTaglines = data.content?.hero_taglines;
      const parsed = (
        Array.isArray(rawTaglines)
          ? rawTaglines
          : String(rawTaglines || "").split(/\r?\n/)
      )
        .map((t) => String(t).trim())
        .filter(Boolean);
      if (parsed.length) setTaglines(parsed);

      if (data.content?.hero_tagline_color)
        setTaglineColor(data.content.hero_tagline_color);
      const sizeNum = Number(data.content?.hero_tagline_size);
      if (sizeNum > 0) setTaglineSize(sizeNum);

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

  const handleImageLoad = (e) => {
    const img = e.target;
    if (img.naturalWidth && img.naturalHeight) {
      setRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
    }
    setImageLoaded(true);
  };

  return (
    <div className="hero-wrapper">
      <section
        className="hero"
        id="home"
        style={ratio ? { "--hero-ar": ratio } : undefined}
      >
        {!loading && (
          <div className="hero-image">
            <picture>
              {/* Phones get the 3:2 picture; wider screens get the banner */}
              <source
                media="(max-width: 768px)"
                srcSet={heroMobile || heroBgFallback}
              />
              <img
                src={heroWide || heroBgWideFallback}
                alt={heading || "Hotel The Grand Alayna"}
                onLoad={handleImageLoad}
                className={imageLoaded ? "loaded" : ""}
              />
            </picture>

            {taglines.length > 0 && (
              <div
                className="hero-tagline"
                aria-label={taglines.join(". ")}
                style={{
                  ...(taglineColor ? { "--tagline-color": taglineColor } : {}),
                  ...(taglineSize
                    ? { "--tagline-size": `${taglineSize}px` }
                    : {}),
                }}
              >
                <AnimatedTagline phrases={taglines} />
              </div>
            )}
          </div>
        )}

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
