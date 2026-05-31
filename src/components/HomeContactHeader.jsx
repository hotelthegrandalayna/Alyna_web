import "./HomeContactHeader.css";
import { Link } from "react-router-dom";

const HomeContactHeader = ({ title, loading = false, image }) => {
  // Fallback hero image if none provided
  const heroImage =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="breadcrumb-nav">
          <Link className="homeLink" to="/">
            Home
          </Link>
          /{" "}
          {loading ? (
            <span className="breadcrumb-skeleton" />
          ) : (
            <span className="active-link">{title}</span>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeContactHeader;
