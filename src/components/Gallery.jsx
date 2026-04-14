import React from "react";
import "./Gallery.css";
import HomeContactHeader from "./HomeContactHeader";
import ScrollReveal from "./ScrollReveal";

const Gallery = () => {
  // Dummy data for the gallery
  const images = [
    {
      id: 1,
      label: "Lobby",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600",
    },
    {
      id: 2,
      label: "Bedroom",
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600",
    },
    {
      id: 3,
      label: "Garden",
      url: "https://images.unsplash.com/photo-1551882547-ff43c6382636?auto=format&fit=crop&w=600",
    },
    {
      id: 4,
      label: "Lobby",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=600",
    },
    {
      id: 5,
      label: "Bedroom",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600",
    },
    // {
    //   id: 6,
    //   label: "Garden",
    //   url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=600",
    // },
  ];

  return (
    <section className="gallery-section">
      <HomeContactHeader title="Gallery" />

      <ScrollReveal />

      <div className="container">
        {/* Video Section */}
        <div className="gallery-group scroll-animate">
          <h3 className="group-title">VIDEO</h3>
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Resort Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Images Grid Section */}
        <div className="gallery-group scroll-animate">
          <h3 className="group-title">IMAGES</h3>
          <div className="image-grid">
            {images.map((img) => (
              <div key={img.id} className="grid-item">
                <img src={img.url} alt={img.label} />
                <span className="image-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
