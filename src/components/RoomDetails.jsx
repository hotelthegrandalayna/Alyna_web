import React, { useState } from "react";
import "./RoomDetails.css";
import { LuChefHat } from "react-icons/lu";
import HomeContactHeader from "./HomeContactHeader";
import { FaPhone } from "react-icons/fa6";
import RoomCalendar from "./RoomCalendar";
import { useEffect } from "react";
import phoneIcon from "../assets/room-service.png";

const RoomDetails = () => {
  const images = [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
  ];

  const [mainImage, setMainImage] = useState(images[0]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="room-page">
      <HomeContactHeader title="The Serene Suite" />

      <div className="container main-content">
        <div className="room-grid">
          {/* Left Column */}
          <div className="room-info">
            <div className="main-image-container">
              <img
                src={mainImage}
                alt="Superior Room"
                className="main-room-img"
              />

              <div className="thumbnails">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="thumb"
                    onClick={() => setMainImage(img)}
                    className={mainImage === img ? "selected-thumb" : ""}
                  />
                ))}
              </div>
            </div>

            <div className="room-text">
              <p>
                Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1900 & 1800 sq ft. These two unique suites boast an octagonal
                living area, the sides of which are fitted with windows
                overlooking the sea.
              </p>
            </div>

            <div className="booking-card-container">
              <div className="outer-glow-border"></div>

              <div className="main-booking-box">
                <div className="content-left">
                  <div className="phone-icon-box">
                    <FaPhone fontSize={"40px"} color="#f27c07" />
                  </div>

                  <div className="cta-and-number">
                    <p className="cta-text">CALL TO CONFIRM BOOKING !</p>

                    <div className="floating-number-box">
                      <span className="phone-number">01878150350</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="room-sidebar">
            <div className="complimentary-section">
              <div className="complimentary-header">
                <LuChefHat size="24px" />
                {/* <img src={phoneIcon} alt="phone icon" className="icon-img" /> */}
                <span>COMPLIMENTARY</span>
              </div>

              <ul>
                <li>Breakfast for 4 pax</li>
                <li>Welcome drink (on arrival)</li>
                <li>Bus-stop pick-up (on demand)</li>
                <li>Mineral water 500ml x 2 bottles</li>
                <li>Internet in the rooms & lobby</li>
              </ul>
            </div>

            <h5 style={{ color: "#6547DB" }}>CHECK AVAILABILITY</h5>

            <div className="availability-card">
              <RoomCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
