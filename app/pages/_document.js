import { Html, Head, Main, NextScript } from "next/document";
import { Partytown } from "@qwik.dev/partytown/react";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
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

        {/* Shortcut Icon */}
        <link
          rel="shortcut icon"
          type="image/webp"
          href="/icons/icon-32x32.webp"
        />

        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />

        {/* Microsoft Tiles */}
        <meta
          name="msapplication-square150x150logo"
          content="/icons/icon-150x150.webp"
        />
        <meta
          name="msapplication-square310x310logo"
          content="/icons/icon-310x310.webp"
        />

        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1e293b" />

        {/* Yandex */}
        <meta name="yandex-verification" content="b5c3a28f16fc141a" />

        {/* Google Analytics with Partytown */}
        <Partytown forward={["dataLayer.push"]} />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-V8DHJ6KM0Y"
        ></script>
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("js", new Date());
              gtag("config", "G-V8DHJ6KM0Y");
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
