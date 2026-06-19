import React, { useEffect, useState } from "react";
import "./Gallery.css";
import HomeContactHeader from "./HomeContactHeader";
import ScrollReveal from "./ScrollReveal";
import { supabase } from "../lib/supabaseClient";
import OptimizedImage from "./OptimizedImage";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // normalize common video links to embed-friendly URLs
  const getEmbedUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();

    // YouTube: handle watch URLs, short youtu.be, and already-embed URLs
    const ytMatch = trimmed.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    );
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
    }

    // If it's already an embed URL (vimeo or youtube) return as-is
    if (
      trimmed.includes("youtube.com/embed") ||
      trimmed.includes("player.vimeo.com")
    )
      return trimmed;

    return null;
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        if (!mounted) return;
        const mapped = (data || []).map((r) => {
          const url = r.url;
          if (url && url.startsWith("http")) return { ...r, url };
          try {
            const { data: urlData } = supabase.storage
              .from("images")
              .getPublicUrl(url);
            return {
              ...r,
              url:
                (urlData && (urlData.publicUrl || urlData.public_url)) || url,
            };
          } catch (e) {
            return r;
          }
        });
        setImages(mapped);

        // load gallery page row for video_url
        try {
          const { data: page } = await supabase
            .from("pages")
            .select("*")
            .eq("slug", "gallery")
            .maybeSingle();
          if (page) {
            const v = page.video_url || page.content?.video_url || null;
            setVideoUrl(v);
          }
        } catch (e) {
          console.error("Failed to load gallery video_url:", e);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const openModal = (img) => {
    setModalImage(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalImage(null), 200);
  };

  return (
    <section className="gallery-section">
      <HomeContactHeader title="Gallery" />

      <ScrollReveal />

      <div className="container">
        {/* Video Section */}
        <div className="gallery-group scroll-animate">
          <h3 className="group-title">VIDEO</h3>
          <div className="video-container">
            {(() => {
              const embed = getEmbedUrl(videoUrl);
              if (embed) {
                return (
                  <iframe
                    src={embed}
                    title="Resort Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              // fallback: default embed
              // return (
              //   <iframe
              //     src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              //     title="Resort Video"
              //     frameBorder="0"
              //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              //     allowFullScreen
              //   />
              // );
            })()}
          </div>
        </div>

        {/* Images Grid Section */}
        <div className="gallery-group scroll-animate">
          <h3 className="group-title">IMAGES</h3>
          <div className="image-grid">
            {images.map((img) => (
              <div key={img.id} className="grid-item">
                <OptimizedImage src={img.url} alt={img.label} onClick={() => openModal(img)} />
                <span className="image-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close image">×</button>
            {modalImage && (
              <img src={modalImage.url} alt={modalImage.label || "Gallery image"} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
