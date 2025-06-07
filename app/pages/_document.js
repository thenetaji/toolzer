import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Toolzer" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1e293b" />

        {/* Yandex */}
        <meta name="yandex-verification" content="b5c3a28f16fc141a" />

        {/* Google Analytics */}
        <Script
          strategy="worker"
          id="tag"
          src="https://www.googletagmanager.com/gtag/js?id=G-V8DHJ6KM0Y"
        ></Script>
        <Script
          strategy="worker"
          id="window-layer"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("js", new Date());
              gtag("config", "G-V8DHJ6KM0Y");
            `,
          }}
        />
        <Script
          strategy="worker"
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="C5aYtfiMQkYT/orxDj9DTA"
          async
        ></Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
