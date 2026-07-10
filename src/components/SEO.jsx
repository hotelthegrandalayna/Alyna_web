import { Helmet } from "react-helmet-async";

const SITE_URL = "https://hotelthegrandalayna.com";
const SITE_NAME = "Hotel The Grand Alayna";
const DEFAULT_DESCRIPTION =
  "Hotel The Grand Alayna is a boutique hotel in Sitakund, Chittagong offering spotless rooms, warm hospitality and 24/7 reception. Minutes from Chandranath Temple, Guliakhali Beach and Eco Park.";

export default function SEO({ title, description, path = "/" }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Hotel in Sitakund, Chittagong`;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
