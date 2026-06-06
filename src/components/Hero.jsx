import "./Hero.css";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

// ─── Helpers ───────────────────────────────────────────────────────────────
const normalize = (val) => (val ? String(val).replace(/\\n|\/n/g, "\n") : val);

const resolveImage = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  const { data } = supabase.storage.from("images").getPublicUrl(img);
  return data?.publicUrl || img;
};

// ─── Module-level cache ────────────────────────────────────────────────────
// loadedImages persists across navigations so we never wait for onLoad twice.
const loadedImages = new Set();

// Read sessionStorage SYNCHRONOUSLY right now, before any React render.
// This means cache.data is already populated when useState() lazy-initializer runs.
let cachedData = null;
try {
  const raw = sessionStorage.getItem("hero_home");
  if (raw) {
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < 10 * 60 * 1000) cachedData = data;
  }
} catch (_) {}

const cache = { data: cachedData };

// Background fetch — only runs when sessionStorage is empty/stale
const heroPromise = cache.data
  ? Promise.resolve(cache.data)
  : (async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("hero_image, hero_heading, hero_subtext")
        .eq("slug", "home")
        .maybeSingle();

      if (error || !data) return null;

      const result = {
        hero_image: resolveImage(data.hero_image),
        hero_heading: normalize(data.hero_heading),
        hero_subtext: normalize(data.hero_subtext),
      };

      sessionStorage.setItem(
        "hero_home",
        JSON.stringify({ data: result, ts: Date.now() }),
      );
      cache.data = result;
      return result;
    })();

// ─── Component ─────────────────────────────────────────────────────────────
export default function Hero() {
  // Both of these read synchronously from cache — zero async gap on remount
  const [hero, setHero] = useState(() => cache.data);
  const [imageLoaded, setImageLoaded] = useState(
    () => !!(cache.data?.hero_image && loadedImages.has(cache.data.hero_image)),
  );
  const contentRef = useRef(null);

  // Only runs on very first page load when cache is cold
  useEffect(() => {
    if (cache.data) return;
    let mounted = true;
    heroPromise.then((data) => {
      if (!mounted || !data) return;
      cache.data = data;
      setHero(data);
      if (data.hero_image && loadedImages.has(data.hero_image)) {
        setImageLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Fade-in class
  useEffect(() => {
    if (hero && imageLoaded) {
      requestAnimationFrame(() => {
        contentRef.current?.classList.add("in-view");
      });
    }
  }, [hero, imageLoaded]);

  const handleImageLoad = (src) => {
    loadedImages.add(src);
    setImageLoaded(true);
  };

  const splitLines = (text) =>
    String(text || "")
      .split("\n")
      .map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ));

  const showContent = hero && imageLoaded;

  return (
    <div className="hero-wrapper">
      <section className="hero" id="home">
        {hero?.hero_image && (
          <div className="hero-image">
            <img
              src={hero.hero_image}
              alt={hero.hero_heading || "Hero image"}
              onLoad={() => handleImageLoad(hero.hero_image)}
              className={imageLoaded ? "loaded" : ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              className={`hero-skeleton skeleton-image ${imageLoaded ? "skeleton-hidden" : ""}`}
            />
          </div>
        )}

        <div
          ref={contentRef}
          className={`hero-content scroll-animate ${showContent ? "content-visible" : ""}`}
          aria-hidden={!showContent}
        >
          {!showContent ? (
            <>
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-sub" />
            </>
          ) : (
            <>
              <h1>{splitLines(hero.hero_heading)}</h1>
              <p>
                <span className="hero-accent"></span>
                {splitLines(hero.hero_subtext)}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
