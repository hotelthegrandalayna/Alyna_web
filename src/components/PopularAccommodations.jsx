import { useState } from "react";
import "./PopularAccommodations.css";
import { FaWifi } from "react-icons/fa";
import { MdOutlineBreakfastDining, MdVerifiedUser } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { FiMonitor } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const accommodations = [
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

  return (
    <section className="popular-accommodations" id="rooms">
      <div className="section-header">
        <span className="section-label">POPULAR ACCOMMODATIONS</span>
        <h2>Explore Our Popular Stays</h2>
      </div>

      <div className="accommodation-cards">
        {accommodations.map((item) => {
          const activeIndex = activeImages[item.id] || 0;

          return (
            <article key={item.id} className="accommodation-card">
              <div className="card-image">
                <img src={item.images[activeIndex]} alt={item.title} />

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
                <p>{item.description}</p>
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
