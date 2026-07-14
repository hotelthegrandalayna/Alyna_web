import SEO from "./SEO";
import HomeContactHeader from "./HomeContactHeader";
import ScrollReveal from "./ScrollReveal";
import PopularAccommodations from "./PopularAccommodations";

export default function RoomsPage() {
  return (
    <section className="rooms-page">
      <SEO
        title="Rooms & Rates"
        description="See all room categories at Hotel The Grand Alayna in Sitakund, Chittagong — budget to luxury rooms with prices, photos and amenities."
        path="/rooms"
      />
      <HomeContactHeader title="Rooms" />

      <ScrollReveal />

      <PopularAccommodations
        label="OUR ROOMS"
        heading="Choose Your Perfect Stay"
      />
    </section>
  );
}
