import React from "react";

const buildSrcSet = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("images.unsplash.com")) {
      const widths = [480, 768, 1024, 1600];
      return widths
        .map((w) => `${url}${url.includes("?") ? "&" : "?"}w=${w}&q=80 ${w}w`)
        .join(", ");
    }
  } catch (e) {}
  return null;
};

export default function OptimizedImage({ src, alt, className, onLoad, priority = false, style = {}, onClick }) {
  const srcSet = buildSrcSet(src);

  // try to resolve an LQIP mapping saved in sessionStorage (uploader may have created it)
  let lqip = null;
  if (typeof window !== "undefined") {
    try {
      const map = JSON.parse(sessionStorage.getItem("lqip_map") || "{}");
      if (map && map[src]) lqip = map[src];
    } catch (e) {
      lqip = null;
    }
  }

  if (lqip) {
    return (
      <div className={className} style={{ position: "relative", overflow: "hidden", display: "block", ...style }} onClick={onClick}>
        <img
          src={lqip}
          alt={alt}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px)", transform: "scale(1.05)" }}
        />
        <img
          src={src}
          srcSet={srcSet || undefined}
          sizes={srcSet ? "(max-width: 768px) 100vw, 768px" : undefined}
          alt={alt}
          onLoad={onLoad}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={priority ? "high" : "low"}
          style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onClick={onClick}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={srcSet ? "(max-width: 768px) 100vw, 768px" : undefined}
      alt={alt}
      className={className}
      onLoad={onLoad}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : "low"}
      style={{ display: "block", ...style }}
      onClick={onClick}
    />
  );
}
