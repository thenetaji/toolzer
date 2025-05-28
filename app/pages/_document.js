import { Html, Head, Main, NextScript } from "next/document";
import { Partytown } from "@qwik.dev/partytown/react";

export default function Document() {
  const baseImageURL = "https://res.cloudinary.com/dquw84tih/image/upload";

  return (
    <Html lang="en" className="dark">
      <Head>
        {/* Favicons */}
        {[16, 32, 48, 72, 96, 144, 152, 167, 180, 192, 256, 512].map((size) => (
          <link
            key={size}
            rel="icon"
            type="image/png"
            sizes={`${size}x${size}`}
            href={`${baseImageURL}/f_auto,q_auto,c_fill,w_${size},h_${size}/toolzer-logo_cpfiyf`}
          />
        ))}

        {/* Apple Touch Icons */}
        {[120, 152, 167, 180].map((size) => (
          <link
            key={size}
            rel="apple-touch-icon"
            type="image/png"
            sizes={`${size}x${size}`}
            href={`${baseImageURL}/f_auto,q_auto,c_fill,w_${size},h_${size}/toolzer-logo_cpfiyf`}
          />
        ))}

        {/* Shortcut Icon */}
        <link
          rel="shortcut icon"
          href={`${baseImageURL}/f_auto,q_auto,c_fill,w_64,h_64/toolzer-logo_cpfiyf`}
        />

        <link
          rel="icon"
          type="image/x-icon"
          href={`${baseImageURL}/favicon_jg6fvb.ico`}
        />

        {/* Microsoft Tiles */}
        <meta
          name="msapplication-square150x150logo"
          content={`${baseImageURL}/f_auto,q_auto,c_fill,w_150,h_150/toolzer-logo_cpfiyf`}
        />
        <meta
          name="msapplication-square310x310logo"
          content={`${baseImageURL}/f_auto,q_auto,c_fill,w_310,h_310/toolzer-logo_cpfiyf`}
        />

        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1e293b" />

        {/* Yandex */}
        <meta name="yandex-verification" content="313a70d4f279d51f" />

        {/* Google Analytics with Partytown */}
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
              gtag("js", new Date());
              gtag("config", "G-75W2QXCJXB");
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
