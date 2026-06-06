import { useEffect, useState } from "react";
import "./PopularAccommodations.css";
import { FaWifi } from "react-icons/fa";
import { MdOutlineBreakfastDining, MdVerifiedUser } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { FiMonitor } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";
import OptimizedImage from "./OptimizedImage";

// fallback/static data used when DB fetch fails
const staticAccommodations = [
  {
    id: 1,
    title: "The Serena Suite",
    description: "Retro-spacious. For a smooth family retreat.",
    tags: ["Luxury", "Comfort"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
    ],
    links: "/room",
  },
  {
    id: 2,
    title: "The Explorer's Hideaway",
    description: "Save on stay with comfort.",
    tags: ["Standard", "Budget"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
    ],
    links: "/room2",
  },
];

export default function PopularAccommodations() {
  const [activeImages, setActiveImages] = useState({});
  const [accommodations, setAccommodations] = useState(staticAccommodations);

  useEffect(() => {
    let mounted = true;

    async function loadAccommodations() {
      try {
        const { data, error } = await supabase
          .from("accommodations")
          .select("*");
        if (error) {
          console.error(
            "Error loading accommodations:",
            error.message || error,
          );
          return;
        }

        if (!mounted || !data) return;

        // map DB rows into the UI shape and resolve storage paths to public URLs
        const mapped = data.map((row, idx) => {
          const rawImages =
            row.images && row.images.length
              ? row.images
              : staticAccommodations[idx % staticAccommodations.length].images;
          const images = (rawImages || []).map((img) => {
            if (!img) return img;
            if (img.startsWith("http")) return img;
            try {
              const { data: urlData } = supabase.storage
                .from("images")
                .getPublicUrl(img);
              return (
                (urlData && (urlData.publicUrl || urlData.public_url)) || img
              );
            } catch (e) {
              return img;
            }
          });

          return {
            id: row.id || idx + 1,
            title: row.title,
            description: row.description,
            tags: row.tags || [],
            images,
            links: row.links || "/",
          };
        });

        setAccommodations(mapped);
      } catch (e) {
        console.error(e);
      }
    }

    loadAccommodations();

    return () => {
      mounted = false;
    };
  }, []);

  const nextImage = (id, total) => {
    setActiveImages((prev) => {
      const current = prev[id] || 0;
      return {
        ...prev,
        [id]: (current + 1) % total,
      };
    });
  };

  const prevImage = (id, total) => {
    setActiveImages((prev) => {
      const current = prev[id] || 0;
      return {
        ...prev,
        [id]: (current - 1 + total) % total,
      };
    });
  };

  const truncateDescription = (html, words = 6) => {
    const text = new DOMParser().parseFromString(html || "", "text/html").body
      .textContent;

    const wordArray = text.trim().split(/\s+/);

    return wordArray.length > words
      ? wordArray.slice(0, words).join(" ") + "..."
      : text;
  };

  return (
    <section className="popular-accommodations" id="rooms">
      <div className="section-header-h">
        <span className="section-label-p">POPULAR ACCOMMODATIONS</span>
        <h2>Explore Our Popular Stays</h2>
      </div>

      <div className="accommodation-cards">
        {accommodations.map((item) => {
          const activeIndex = activeImages[item.id] || 0;

          return (
            <article key={item.id} className="accommodation-card">
              <div className="card-image">
                <OptimizedImage src={item.images[activeIndex]} alt={item.title} />

                <div className="top-buttons">
                  <button className="img-btn">
                    <FaWifi />
                  </button>
                  <button className="img-btn">
                    <MdVerifiedUser />
                  </button>
                  <button className="img-btn">
                    <MdOutlineBreakfastDining />
                  </button>
                  <button className="img-btn">
                    <TbAirConditioning />
                  </button>
                  <button className="img-btn">
                    <FiMonitor />
                  </button>
                </div>

                <div className="slider-controls">
                  <button
                    className="slider-btn"
                    onClick={() => prevImage(item.id, item.images.length)}
                  >
                    ←
                  </button>

                  <button
                    className="slider-btn"
                    onClick={() => nextImage(item.id, item.images.length)}
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="card-content">
                <div className="card-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3>{item.title}</h3>
                <p>{truncateDescription(item.description, 6)}</p>
                {/* 
                <button className="btn-details">See Details</button> */}

                <NavLink to={item.links} className="details-link">
                  <button className="btn-details">See Details</button>
                </NavLink>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
