import React from "react";
import "./AboutPage.css";
import HomeContactHeader from "./HomeContactHeader";
import ScrollReveal from "./ScrollReveal";
import OptimizedImage from "./OptimizedImage";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AboutPage = () => {
  const [heroImage, setHeroImage] = useState("");
  const [visionBg, setVisionBg] = useState("");
  const [founderImage, setFounderImage] = useState("");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data, error } = await supabase.from("pages").select("*").eq("slug", "about").maybeSingle();
        if (error) throw error;
        if (!mounted || !data) return;

        const img = data.hero_image || "";
        let publicUrl = img;
        if (img && !img.startsWith("http")) {
          const { data: urlData } = supabase.storage.from("images").getPublicUrl(img);
          publicUrl = (urlData && (urlData.publicUrl || urlData.public_url)) || img;
        }
        setHeroImage(publicUrl || "");

        // attempt to use first feature image as founder image
        const pgContent = data.content || {};
        setContent(pgContent || {});
        console.debug("About page content loaded:", pgContent);

        // founder image from content.founder.image or first feature image
        let founderSrc = (pgContent.founder && pgContent.founder.image) || (pgContent.feature_images && pgContent.feature_images[0]) || null;
        if (founderSrc && typeof founderSrc !== "string") {
          if (Array.isArray(founderSrc)) founderSrc = founderSrc[0] || null;
          else if (typeof founderSrc === "object") founderSrc = founderSrc.url || founderSrc.path || founderSrc.key || null;
          else founderSrc = null;
        }
        if (founderSrc) {
          let fUrl = founderSrc;
          if (founderSrc && typeof founderSrc === "string" && !founderSrc.startsWith("http")) {
            try {
              const { data: u } = supabase.storage.from("images").getPublicUrl(founderSrc);
              fUrl = (u && (u.publicUrl || u.public_url)) || founderSrc;
            } catch (e) {
              fUrl = founderSrc;
            }
          }
          setFounderImage(fUrl || "");
        }

        // vision background from content.vision.bg_image or hero_image
        let vBg = (pgContent.vision && pgContent.vision.bg_image) || img;

        // normalize non-string values (array/object) into a string path/url
        if (vBg && typeof vBg !== "string") {
          if (Array.isArray(vBg)) vBg = vBg[0] || "";
          else if (typeof vBg === "object") vBg = vBg.url || vBg.path || vBg.key || "";
          else vBg = "";
        }

        let vUrl = vBg || "";
        if (vBg && typeof vBg === "string" && !vBg.startsWith("http")) {
          try {
            const { data: u2 } = supabase.storage.from("images").getPublicUrl(vBg);
            vUrl = (u2 && (u2.publicUrl || u2.public_url)) || vBg;
          } catch (e) {
            vUrl = vBg;
          }
        }
        setVisionBg(vUrl || "");
        console.debug("Vision bg resolved to:", vUrl);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // trigger reveal when loaded
  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => {
        document.querySelectorAll(".scroll-animate").forEach((el) => el.classList.add("in-view"));
      });
    }
  }, [loading]);

  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <HomeContactHeader title="About" loading={loading} image={heroImage} />

      <ScrollReveal />

      {/* Mission Section */}
      <section className="content-block purple-section">
        <div className="content-container scroll-animate">
          <div className="flex-row">
            <div className="title-col">
                <h2>{!loading && (content.mission && content.mission.heading) ? content.mission.heading : (loading ? "" : "OUR MISSION")}</h2>
            </div>
              <div className="text-col">
                <p>{!loading && (content.mission && content.mission.text) ? content.mission.text : (loading ? "" : "Attractively ornamented with complete marble & tiles and luxurious fabrics.")}</p>
              </div>
          </div>
        </div>
      </section>

      {/* Vision Section (Background Image) */}
      <section
        className="content-block vision-bg-section"
        style={{ backgroundImage: `url("${visionBg}")` }}
      >
        <div className="dark-overlay"></div>
        <div className="content-container scroll-animate">
          <div className="flex-row">
              <div className="title-col">
                <h2>{!loading && (content.vision && content.vision.heading) ? content.vision.heading : (loading ? "" : "OUR VISION")}</h2>
              </div>
              <div className="text-col">
                <p>{!loading && (content.vision && content.vision.text) ? content.vision.text : (loading ? "" : "Attractively ornamented with complete marble & tiles and luxurious fabrics.")}</p>
              </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="content-block purple-section">
        <div className="content-container scroll-animate">
          <div className="flex-row">
            <div className="title-col">
              <h2>{!loading && (content.values && content.values.heading) ? content.values.heading : (loading ? "" : "OUR VALUES")}</h2>
            </div>
            <div className="text-col">
              <p>{!loading && (content.values && content.values.text) ? content.values.text : (loading ? "" : "Attractively ornamented with complete marble & tiles and luxurious fabrics.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="content-container scroll-animate">
          <div className="founder-layout">
            <div className="founder-info">
              <h2>{!loading && (content.founder && content.founder.heading) ? content.founder.heading : (loading ? "" : "WHAT OUR\nFOUNDER HAS TO SAY!")}</h2>
              <p>{!loading && (content.founder && content.founder.text) ? content.founder.text : (loading ? "" : "Attractively ornamented with complete marble & tiles and luxurious fabrics.")}</p>
            </div>
            <div className="founder-photo-box">
              <div className="photo-accent">
                <OptimizedImage src={founderImage} alt="Founder" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
