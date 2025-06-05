import NextHead from "next/head";
import { useRouter } from "next/router";

export default function Head({
  title,
  description,
  imageName = "homepage-preview_ki1ld9",
  featureList,
  lastModified,
}) {
  const router = useRouter();
  const currentPath = router.asPath || "/";
  const fullUrl = `https://toolzer.studio${currentPath}`;

  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={fullUrl} />

      {lastModified && (
        <meta property="article:modified_time" content={lastModified} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={`${process.env.BASE_IMAGE_URL || ""}/f_auto,q_auto,c_fill,w_1200,h_630/${imageName}`}
      />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Toolzer" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:image"
        content={`${process.env.BASE_IMAGE_URL || ""}/f_auto,q_auto,c_fill,w_1200,h_630/${imageName}`}
      />

      {/* JSON-LD Schema */}
      {featureList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Toolzer",
              alternateName: ["Toolzer Studio"],
              url: fullUrl,
              description,
              applicationCategory: "Utility",
              operatingSystem: "All",
              browserRequirements:
                "Requires JavaScript. Works in all modern browsers.",
              featureList,
              offers: {
                "@type": "Offer",
                price: "0.00",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      )}
    </NextHead>
  );
}
