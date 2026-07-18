import "./ExploreSitakund.css";
import imgChandranath from "../assets/explore/chandranath.jpg";
import imgGuliakhali from "../assets/explore/guliakhali.jpg";
import imgEcopark from "../assets/explore/ecopark.jpg";
import imgSuptadhara from "../assets/explore/suptadhara.jpg";
import imgBanshbaria from "../assets/explore/banshbaria.jpg";

const HOTEL = "Hotel The Grand Alayna, Sitakund";

/* Google Maps directions from the hotel to a destination */
const directionsUrl = (destination) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    HOTEL,
  )}&destination=${encodeURIComponent(destination)}`;

/* Nearby attractions — the reason many guests come to Sitakund.
   `image`: optional photo (imported asset); cards fall back to the icon. */
const ATTRACTIONS = [
  {
    icon: "🛕",
    image: imgChandranath,
    name: "Chandranath Temple",
    destination: "Chandranath Temple, Sitakunda",
    distance: "A short drive from the hotel",
    text: "Sacred hilltop temple and one of the region's most famous pilgrimage sites, with panoramic views over Sitakund.",
  },
  {
    icon: "🏖️",
    image: imgGuliakhali,
    name: "Guliakhali Sea Beach",
    destination: "Guliakhali Sea Beach, Sitakunda",
    distance: "A short drive from the hotel",
    text: "The famous “green carpet” beach where grassy mangrove meadows meet the sea — a favourite for sunsets.",
  },
  {
    icon: "🌿",
    image: imgEcopark,
    name: "Botanical Garden & Eco Park",
    destination: "Sitakunda Botanical Garden and Eco Park",
    distance: "Minutes from the hotel",
    text: "Waterfalls, hiking trails and lush greenery inside Sitakund's beloved eco park — perfect for a day out.",
  },
  {
    icon: "💦",
    image: imgSuptadhara,
    name: "Suptadhara Waterfall",
    destination: "Suptadhara Waterfall, Sitakunda",
    distance: "Inside the eco park",
    text: "Thunderous waterfall with several cascades pouring over greenery-clad cliffs into a natural swimming hole.",
  },
  {
    icon: "🌊",
    name: "Soiyodpur Sea Beach",
    destination: "Soiyodpur Sea Beach, Saidpur, Sitakunda",
    distance: "A short drive from the hotel",
    text: "A quiet, mangrove-fringed shoreline near Saidpur — green, calm and wonderfully uncrowded.",
  },
  {
    icon: "🌅",
    image: imgBanshbaria,
    name: "Banshbaria Sea Beach",
    destination: "Banshbaria Sea Beach, Kumira",
    distance: "A short drive from the hotel",
    text: "Beloved sunset beach with tree groves and a long walkway stretching out into the sea.",
  },
];

export default function ExploreSitakund() {
  return (
    <section className="explore-sitakund" id="explore">
      <div className="section-header-h">
        <span className="section-label-p">EXPLORE SITAKUND</span>
        <h2>Adventures at Your Doorstep</h2>
      </div>

      <div className="explore-cards">
        {ATTRACTIONS.map((a) => (
          <a
            key={a.name}
            className="explore-card"
            href={directionsUrl(a.destination)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Directions from the hotel to ${a.name}`}
          >
            {a.image ? (
              <div className="explore-card-media">
                <img src={a.image} alt={a.name} />
              </div>
            ) : (
              <div className="explore-card-icon" aria-hidden="true">
                {a.icon}
              </div>
            )}
            <h3>{a.name}</h3>
            <span className="explore-card-distance">{a.distance}</span>
            <p>{a.text}</p>
            <span className="explore-card-cta">
              Get directions from the hotel →
            </span>
          </a>
        ))}
      </div>

      <p className="explore-credits">
        Photos: Kazi Md. Jahirul Islam, Syed Sajidul Islam, Owais Al Qarni,
        Beylarbey via Wikimedia Commons,{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-SA 4.0
        </a>
      </p>
    </section>
  );
}
