import { Helmet } from "react-helmet-async";

const SITE_URL = "https://hotelthegrandalayna.com";
const SITE_NAME = "Hotel The Grand Alayna";
const DEFAULT_DESCRIPTION =
  "Hotel The Grand Alayna is a boutique hotel in Sitakund, Chittagong offering spotless rooms, warm hospitality and 24/7 reception. Minutes from Chandranath Temple, Guliakhali Beach and Eco Park.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function SEO({
  title,
  description,
  path = "/",
  image,
  noindex = false,
}) {
  // Brand-first on the homepage; "Page | Brand" on inner pages
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Hotel in Sitakund, Chittagong`;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph (Facebook/WhatsApp link previews) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter/X cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
