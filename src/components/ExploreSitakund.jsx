import "./ExploreSitakund.css";

/* Nearby attractions — the reason many guests come to Sitakund.
   Text lives here; photos can be added later via the CMS pattern. */
const ATTRACTIONS = [
  {
    icon: "🛕",
    name: "Chandranath Temple",
    distance: "A short drive from the hotel",
    text: "Sacred hilltop temple and one of the region's most famous pilgrimage sites, with panoramic views over Sitakund.",
  },
  {
    icon: "🏖️",
    name: "Guliakhali Sea Beach",
    distance: "A short drive from the hotel",
    text: "The famous “green carpet” beach where grassy mangrove meadows meet the sea — a favourite for sunsets.",
  },
  {
    icon: "🌿",
    name: "Botanical Garden & Eco Park",
    distance: "Minutes from the hotel",
    text: "Waterfalls, hiking trails and lush greenery inside Sitakund's beloved eco park — perfect for a day out.",
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
          <article key={a.name} className="explore-card">
            <div className="explore-card-icon" aria-hidden="true">
              {a.icon}
            </div>
            <h3>{a.name}</h3>
            <span className="explore-card-distance">{a.distance}</span>
            <p>{a.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
