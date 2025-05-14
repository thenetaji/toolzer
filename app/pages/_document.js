import { Html, Head, Main, NextScript } from "next/document";
import { Partytown } from "@qwik.dev/partytown/react";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <meta charSet="UTF-8" />

        {/* Favicons */}
        {[16, 32, 48, 72, 96, 144, 152, 167, 180, 192, 256, 512].map((size) => (
          <link
            key={size}
            rel="icon"
            type="image/webp"
            sizes={`${size}x${size}`}
            href={`/icons/icon-${size}x${size}.webp`}
          />
        ))}

        {/* Apple Touch Icons */}
        {[120, 152, 167, 180].map((size) => (
          <link
            key={size}
            rel="apple-touch-icon"
            type="image/webp"
            sizes={`${size}x${size}`}
            href={`/icons/icon-${size}x${size}.webp`}
          />
        ))}

        {/* Microsoft */}
        <meta
          name="msapplication-square150x150logo"
          content="/icons/icon-150x150.webp"
        />
        <meta
          name="msapplication-square310x310logo"
          content="/icons/icon-310x310.webp"
        />

        {/* SEO */}
        <meta
          name="description"
          content="Toolzer brings all online tools in one place — from file converters to SEO, image editors, downloaders, and dev utilities. 100% free, fast, and ad-free."
        />
        <meta
          name="keywords"
          content="Toolzer brings all online tools in one place — from file converters to SEO, image editors, downloaders, and dev utilities. 100% free, fast, and ad-free."
        />
        <meta name="author" content="thenetaji" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1e293b" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Toolzer | Every Online Tool You’ll Ever Need — Free & Fast"
        />
        <meta
          property="og:description"
          content="Toolzer brings all online tools in one place — from file converters to SEO, image editors, downloaders, and dev utilities. 100% free, fast, and ad-free."
        />
        <meta
          property="og:image"
          content="https://toolzer.pages.dev/icons/icon-512x512.webp"
        />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:url" content="https://toolzer.pages.dev" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Toolzer | Every Online Tool You’ll Ever Need — Free & Fast"
        />
        <meta
          name="twitter:description"
          content="Toolzer brings all online tools in one place — from file converters to SEO, image editors, downloaders, and dev utilities. 100% free, fast, and ad-free."
        />
        <meta
          name="twitter:image"
          content="https://toolzer.pages.dev/icons/icon-512x512.webp"
        />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Toolzer",
              url: "https://toolzer.pages.dev",
              description:
                "Toolzer brings all online tools in one place — from file converters to SEO, image editors, downloaders, and dev utilities. 100% free, fast, and ad-free.",
              applicationCategory: "Utility",
              operatingSystem: "All",
              browserRequirements:
                "Requires JavaScript. Works in all modern browsers.",
              featureList: [
                "No login required",
                "Free API access",
                "25+ online tools",
                "File converters",
                "Media processing (audio, video, image)",
                "Text and code utilities",
                "AI-powered features",
                "Mobile and desktop compatible",
              ],
            }),
          }}
        />

        {/* Yandex */}
        <meta name="yandex-verification" content="313a70d4f279d51f" />

        <Partytown forward={["dataLayer.push"]} />
        <script
          type="text/partytown"
          src="https://www.googletagmanager.com/gtag/js?id=G-75W2QXCJXB"
        />
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-75W2QXCJXB');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
