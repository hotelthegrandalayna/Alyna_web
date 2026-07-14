import { useEffect, useState } from "react";
import "./PopularAccommodations.css";
import { FaWifi } from "react-icons/fa";
import { MdOutlineBreakfastDining, MdVerifiedUser } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { FiMonitor } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";
import OptimizedImage from "./OptimizedImage";

function slugify(text) {
  if (!text) return null;
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PopularAccommodations({
  label = "POPULAR ACCOMMODATIONS",
  heading = "Explore Our Popular Stays",
}) {
  const [activeImages, setActiveImages] = useState({});
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAccommodations() {
      try {
        const { data, error } = await supabase
          .from("accommodations")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error(
            "Error loading accommodations:",
            error.message || error,
          );
        }

        const rows = data || [];

        const mapped = rows.map((row, idx) => {
          const rawImages =
            Array.isArray(row.images) && row.images.length ? row.images : [];
          const images = (rawImages || []).map((img) => {
            if (!img) return "";
            if (img.startsWith("http")) return img;
            try {
              const { data: urlData } = supabase.storage
                .from("images")
                .getPublicUrl(img);
              return (
                (urlData && (urlData.publicUrl || urlData.public_url)) || img
              );
            } catch (_e) {
              return img;
            }
          });

          const genSlug =
            row.slug ||
            slugify(row.title) ||
            (row.id ? String(row.id) : `room-${Date.now()}`);

          return {
            id: row.id || idx + 1,
            slug: genSlug,
            title: row.title || "Untitled",
            description: row.description || "",
            extendedTitle:
              row.extended_title ||
              row.extended_titel ||
              row.extendedTitle ||
              "",
            tags: row.tags || [],
            images,
            links: `/rooms/${genSlug}`,
            price: row.price ?? 2000,
          };
        });

        if (mounted) setAccommodations(mapped);
      } catch (_e) {
        console.error(_e);
      } finally {
        if (mounted) setLoading(false);
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
        [id]: (current + 1) % Math.max(total, 1),
      };
    });
  };

  const prevImage = (id, total) => {
    setActiveImages((prev) => {
      const current = prev[id] || 0;
      return {
        ...prev,
        [id]: (current - 1 + Math.max(total, 1)) % Math.max(total, 1),
      };
    });
  };

  const truncateDescription = (html, words = 6) => {
    const text =
      new DOMParser().parseFromString(html || "", "text/html").body
        .textContent || "";
    const wordArray = text.trim().split(/\s+/);
    return wordArray.length > words
      ? wordArray.slice(0, words).join(" ") + "..."
      : text;
  };

  return (
    <section className="popular-accommodations" id="rooms">
      <div className="section-header-h">
        <span className="section-label-p">{label}</span>
        <h2>{heading}</h2>
      </div>

      <div className="accommodation-cards">
        {loading ? (
          <div style={{ padding: 24 }}>Loading accommodations…</div>
        ) : accommodations.length === 0 ? (
          <div style={{ padding: 24 }}>No accommodations available.</div>
        ) : (
          accommodations.map((item) => {
            const activeIndex = activeImages[item.id] || 0;
            const imageSrc =
              item.images && item.images.length ? item.images[activeIndex] : "";

            return (
              <article key={item.id} className="accommodation-card">
                <div className="card-image">
                  <OptimizedImage src={imageSrc} alt={item.title} />
                  {item.price !== null &&
                    item.price !== undefined &&
                    item.price !== "" && (
                      <div className="price-badge">
                        <span className="p-amount">৳{item.price}</span>
                        <span className="p-label">/night</span>
                      </div>
                    )}
                  <div className="top-buttons">
                    <button className="img-btn">
                      <FaWifi />
                    </button>
                    <button className="img-btn">
                      <MdVerifiedUser />
                    </button>
                    {/* <button className="img-btn">
                      <MdOutlineBreakfastDining />
                    </button> */}
                    {item.title !== "The Explorer Dune " && (
                      <button className="img-btn">
                        <TbAirConditioning />
                      </button>
                    )}
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
                  <p>
                    {item.extendedTitle
                      ? item.extendedTitle
                      : truncateDescription(item.description, 6)}
                  </p>

                  <NavLink to={item.links} className="details-link">
                    <button className="btn-details">See Details</button>
                  </NavLink>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
