
import { Html, Head, Main, NextScript } from "next/document";
import { Partytown } from "@qwik.dev/partytown/react";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Toolzer" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />

        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1e293b" />

        {/* Yandex */}
        <meta name="yandex-verification" content="b5c3a28f16fc141a" />
        {/* Ahrefs Analytics */}
        <script
          type="text/partytown"
          src="https://analytics.ahrefs.com/analytics.js"
          async
          data-key="C5aYtfiMQkYT/orxDj9DTA"
        />
      </Head>
      <body>
        {/** Google Tag Manager (noscript) **/}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PT28VDL2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/** End Google Tag Manager (noscript) **/}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
