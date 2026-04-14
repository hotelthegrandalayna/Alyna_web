import React from "react";
import "./AboutPage.css";
import HomeContactHeader from "./HomeContactHeader";
import ScrollReveal from "./ScrollReveal";

const AboutPage = () => {
  // Online Dummy Images
  const heroImage =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";
  const visionBg =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";
  const founderImage =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <HomeContactHeader title="About" />

      <ScrollReveal />

      {/* Mission Section */}
      <section className="content-block purple-section">
        <div className="content-container scroll-animate">
          <div className="flex-row">
            <div className="title-col">
              <h2>OUR MISSION</h2>
            </div>
            <div className="text-col">
              <p>
                Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft. These two unique suites boast an octagonal
                living area, the sides of which are fitted with windows
                overlooking the sea, the Bay of Bengal for the best views in the
                city. Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section (Background Image) */}
      <section
        className="content-block vision-bg-section"
        style={{ backgroundImage: `url(${visionBg})` }}
      >
        <div className="dark-overlay"></div>
        <div className="content-container scroll-animate">
          <div className="flex-row">
            <div className="title-col">
              <h2>OUR VISION</h2>
            </div>
            <div className="text-col">
              <p>
                Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft. These two unique suites boast an octagonal
                living area, the sides of which are fitted with windows
                overlooking the sea, the Bay of Bengal for the best views in the
                city. Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="content-block purple-section">
        <div className="content-container scroll-animate">
          <div className="flex-row">
            <div className="title-col">
              <h2>OUR VALUES</h2>
            </div>
            <div className="text-col">
              <p>
                Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft. These two unique suites boast an octagonal
                living area, the sides of which are fitted with windows
                overlooking the sea, the Bay of Bengal for the best views in the
                city. Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="content-container scroll-animate">
          <div className="founder-layout">
            <div className="founder-info">
              <h2>WHAT OUR FOUNDER HAS TO SAY!</h2>
              <p>
                Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft. These two unique suites boast an octagonal
                living area, the sides of which are fitted with windows
                overlooking the sea, the Bay of Bengal for the best views in the
                city. Attractively ornamented with complete marble & tiles and
                luxurious fabrics, our two prominent Presidential suites are
                1500-1800 sq ft.
              </p>
            </div>
            <div className="founder-photo-box">
              <div className="photo-accent">
                <img src={founderImage} alt="Founder" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
