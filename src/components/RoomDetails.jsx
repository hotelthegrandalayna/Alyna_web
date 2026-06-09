import React, { useState, useEffect } from "react";
import "./RoomDetails.css";
import { LuChefHat } from "react-icons/lu";
import HomeContactHeader from "./HomeContactHeader";
import { FaPhone } from "react-icons/fa6";
import RoomCalendar from "./RoomCalendar";
import phoneIcon from "../assets/room-service.png";
import { supabase } from "../lib/supabaseClient";
import { getRoomKeyFromAcc } from "../lib/roomKey";
import { useParams } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const RoomDetails = () => {
  const { slug } = useParams();

  const [acc, setAcc] = useState(null);
  const [page, setPage] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        console.debug("RoomDetails: loading accommodation for slug=", slug);
        const { data: row, error } = await supabase
          .from("accommodations")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) {
          console.error("RoomDetails: supabase error", error);
          throw error;
        }
        if (!mounted) return;

        console.debug("RoomDetails: accommodation row=", row);

        const accl = row || {};

        // resolve storage paths to public URLs (like PopularAccommodations does)
        const rawImages = (accl && accl.images) || [];
        const images = await Promise.all(
          (rawImages || []).map(async (img) => {
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
          }),
        );

        const accWithUrls = { ...accl, images };
        setAcc(accWithUrls);

        setMainImage(
          images[0] ||
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
        );
        // ensure room calendar uses stable key
        const rk = getRoomKeyFromAcc(accWithUrls) || slug;
        // nothing to set here; RoomCalendar reads roomId prop from caller

        // try to load related page content if slug exists
        const pageSlug = accl.slug
          ? `${accl.slug}-detail`
          : `${accl.id}-detail`;
        try {
          const { data: prow, error: perr } = await supabase
            .from("pages")
            .select("*")
            .eq("slug", pageSlug)
            .maybeSingle();
          if (!perr) setPage(prow || {});
        } catch (e) {
          console.error("Failed to load page content", e);
        }
      } catch (e) {
        console.error("Failed to load accommodation", e);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div className="room-page">
      <HomeContactHeader title={acc?.title || "The Serene Suite"} />

      <div className="container main-content">
        <div className="room-grid">
          {/* Left Column */}
          <div className="room-info scroll-animate">
            <div className="main-image-container">
              <OptimizedImage
                src={mainImage}
                alt={acc?.title || "Superior Room"}
                className="main-room-img"
              />

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
              <p>
                {(page && page.content && page.content.description) ||
                  acc?.description ||
                  "Attractively ornamented with complete marble & tiles and luxurious fabrics."}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="room-sidebar scroll-animate">
            <div className="complimentary-section">
              <div className="complimentary-header">
                <LuChefHat size="24px" />
                {/* <img src={phoneIcon} alt="phone icon" className="icon-img" /> */}
                <span>
                  {acc?.complimentary && acc.complimentary.length
                    ? "COMPLIMENTARY"
                    : "COMPLIMENTARY"}
                </span>
              </div>

              <ul>
                {(
                  (page && page.content && page.content.complimentary) ||
                  (acc && acc.complimentary) || [
                    "Breakfast for 4 pax",
                    "Welcome drink (on arrival)",
                    "Bus-stop pick-up (on demand)",
                    "Mineral water 500ml x 2 bottles",
                    "Internet in the rooms & lobby",
                  ]
                ).map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>

            <h5 className="check">
              {(page && page.content && page.content.availability_heading) ||
                acc?.availability_heading ||
                "CHECK AVAILABILITY"}
            </h5>

            <div className="availability-card">
              <RoomCalendar roomId={getRoomKeyFromAcc(acc) || slug} />
            </div>
          </div>

          <div className="booking-card-container scroll-animate">
            <div className="outer-glow-border"></div>

            <div className="main-booking-box">
              <div className="content-left">
                <div className="phone-icon-box">
                  <FaPhone fontSize={"40px"} color="#f27c07" />
                </div>

                <div className="cta-and-number">
                  <p className="cta-text">CALL TO CONFIRM BOOKING !</p>

                  <div className="floating-number-box">
                    <span className="phone-number">01883352526</span>
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

export default RoomDetails;
