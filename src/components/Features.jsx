import "./Features.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import OptimizedImage from "./OptimizedImage";

import {
  MdOutlineNetworkCheck,
  MdOutlineSupportAgent,
  MdOutdoorGrill,
} from "react-icons/md";
import { FaParking, FaWalking, FaCarSide } from "react-icons/fa";
import { SiNetflix } from "react-icons/si";
import { IoFastFoodOutline } from "react-icons/io5";
import { RiDrinks2Fill, RiCustomerService2Fill } from "react-icons/ri";

export default function Features() {
  const normalizeNewlines = (s) => {
    if (!s) return s;
    return String(s).replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  };
  const [features, setFeatures] = useState([]);
  const [featureImages, setFeatureImages] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const featureIcons = {
    "Free Internet Access": <MdOutlineNetworkCheck />,
    "Free Parking": <FaParking />,
    "Digital check-in": <MdOutlineSupportAgent />,
    "Movies on Projector": <SiNetflix />,
    "Outdoor activity": <FaWalking />,
    "On Order Food service": <IoFastFoodOutline />,
    "Bar.B.Q facility": <MdOutdoorGrill />,
    "Cooling Corner": <RiDrinks2Fill />,
    "On station arrival Receive Service": <FaCarSide />,
    "24/7 Reception service": <RiCustomerService2Fill />,
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data: feats } = await supabase
          .from("features")
          .select("*")
          .order("id", { ascending: true });
        // load the home page row for facilities and feature images
        const { data: page } = await supabase
          .from("pages")
          .select("*")
          .eq("slug", "home")
          .maybeSingle();
        if (!mounted) return;
        setFeatures(feats || []);

        const imgs = (page?.content?.feature_images || []).map((img) => {
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
        setFeatureImages(imgs || []);

        // load facilities for the home page (if any)
        try {
          if (page && page.id) {
            const { data: facs, error: facErr } = await supabase
              .from("facilities")
              .select("*")
              .eq("page_id", page.id)
              .order("id", { ascending: true });

            if (!facErr) {
              const mapped = (facs || []).map((f) => ({
                ...f,
                title: normalizeNewlines(f.title),
                description: normalizeNewlines(f.description),
                images: (f.images || []).map((img) => {
                  if (!img) return img;
                  if (img.startsWith("http")) return img;
                  try {
                    const { data: urlData } = supabase.storage
                      .from("images")
                      .getPublicUrl(img);
                    return (
                      (urlData && (urlData.publicUrl || urlData.public_url)) ||
                      img
                    );
                  } catch (e) {
                    return img;
                  }
                }),
              }));
              setFacilities(mapped);
            }
          }
        } catch (e) {
          console.error("Failed to load facilities:", e);
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

  return (
    <section className="features" id="about">
      {/* Mobile header: show title/description from DB without line-break rendering */}
      <div className="features-mobile-header">
        <span className="section-label-f">FACILITIES</span>
        <h2 className="mobile-title">Explore Our Amenities for All</h2>
      </div>
      <div className="features-grid">
        <div className="features-content">
          <span className="section-label-f">FACILITIES</span>
          <h2>
            {String(facilities?.[0]?.title || "")
              .split("\n")
              .map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
          </h2>
          <p>
            {String(facilities?.[0]?.description || "")
              .split("\n")
              .map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
          </p>
          <div className="feature-images">
            {(facilities?.[0]?.images?.slice(1)?.length
              ? facilities[0].images.slice(1)
              : featureImages
            )
              .slice(0, 3)
              .map((src, i) => (
                <OptimizedImage key={i} src={src} alt={`Feature ${i + 1}`} />
              ))}
          </div>
        </div>
        <div className="features-image">
          {facilities?.[0]?.images?.[0] ? (
            <OptimizedImage
              src={facilities[0].images[0]}
              alt={facilities[0].title}
            />
          ) : featureImages[0] ? (
            <OptimizedImage src={featureImages[0]} alt="BBQ and dining" />
          ) : (
            <div style={{ height: 200, background: "#f4f4f4" }} />
          )}
        </div>
      </div>

      <div className="feature-icons">
        {features.map((f) => (
          <div key={f.id || f.label} className="feature-item">
            <span className="feature-icon">{featureIcons[f.label]}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
