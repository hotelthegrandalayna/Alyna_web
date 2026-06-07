import React, { useState, useEffect } from "react";
import "./RoomDetails.css";
import { LuChefHat } from "react-icons/lu";
import HomeContactHeader from "./HomeContactHeader";
import { FaPhone } from "react-icons/fa6";
import RoomCalendar from "./RoomCalendar";
import { supabase } from "../lib/supabaseClient";
import OptimizedImage from "./OptimizedImage";

const RoomDetails2 = () => {
  const [acc, setAcc] = useState(null);
  const [page, setPage] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: row, error } = await supabase
          .from("accommodations")
          .select("*")
          .eq("slug", "room2")
          .maybeSingle();
        if (error) throw error;
        setAcc(row || {});
        const imgs = (row && row.images) || [];
        setMainImage(imgs[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80");
      } catch (e) {
        console.error("Failed to load accommodation", e);
      }
    };
    const loadPage = async () => {
      try {
        const { data: prow, error: perr } = await supabase.from("pages").select("*").eq("slug", "room2-detail").maybeSingle();
        if (perr) throw perr;
        setPage(prow || {});
      } catch (e) {
        console.error("Failed to load page content", e);
      }
    };

    load();
    loadPage();
  }, []);

  return (
    <div className="room-page">
      <HomeContactHeader title={acc?.title || "Explorer Base Camp"} />

      <div className="container main-content">
        <div className="room-grid">
          {/* Left Column */}
          <div className="room-info scroll-animate">
            <div className="main-image-container">
              <OptimizedImage src={mainImage} alt={acc?.title || "Superior Room"} className="main-room-img" />

              <div className="thumbnails">
                {((acc && acc.images) || []).map((img, index) => (
                  <OptimizedImage
                    key={index}
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() => setMainImage(img)}
                    className={mainImage === img ? "selected-thumb" : ""}
                  />
                ))}
              </div>
            </div>

            <div className="room-text">
              <p>{(page && page.content && page.content.description) || acc?.description || "Attractively ornamented with complete marble & tiles and luxurious fabrics."}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="room-sidebar scroll-animate">
            <div className="complimentary-section">
              <div className="complimentary-header">
                <LuChefHat size="24px" />
                <span>{acc?.complimentary && acc.complimentary.length ? "COMPLIMENTARY" : "COMPLIMENTARY"}</span>
              </div>

              <ul>
                {((page && page.content && page.content.complimentary) || (acc && acc.complimentary) || ["Breakfast for 4 pax", "Welcome drink (on arrival)", "Bus-stop pick-up (on demand)", "Mineral water 500ml x 2 bottles", "Internet in the rooms & lobby"]).map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>

            <h5 className="check">{(page && page.content && page.content.availability_heading) || acc?.availability_heading || "CHECK AVAILABILITY"}</h5>

            <div className="availability-card">
              <RoomCalendar roomId="room2" />
            </div>
          </div>

          <div className="booking-card-container scroll-animate">
            <div className="outer-glow-border"></div>

            <div className="main-booking-box">
              <div className="content-left">
                <div className="phone-icon-box">
                  <FaPhone fontSize={"40px"} color="orange" />
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
      </div>
    </div>
  );
};

export default RoomDetails2;
