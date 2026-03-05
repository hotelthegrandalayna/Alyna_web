import './PopularAccommodations.css';

const accommodations = [
  {
    id: 1,
    title: 'The Serena Suite',
    description: 'Retro-spacious. For a smooth family retreat.',
    tags: ['Luxury', 'Comfort'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  },
  {
    id: 2,
    title: 'The Explorer\'s Hideaway',
    description: 'Save on stay with comfort.',
    tags: ['Standard', 'Budget'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
  },
];

export default function PopularAccommodations() {
  return (
    <section className="popular-accommodations" id="rooms">
      <div className="section-header">
        <span className="section-label">POPULAR ACCOMMODATIONS</span>
        <h2>Explore Our Popular Stays</h2>
      </div>
      <div className="accommodation-cards">
        {accommodations.map((item) => (
          <article key={item.id} className="accommodation-card">
            <div className="card-image">
              <img src={item.image} alt={item.title} />
              <div className="image-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button className="btn-details">See Details</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}