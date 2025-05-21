import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const pageTitle = "Privacy Policy | Toolzer";
  const pageDescription =
    "Learn how Toolzer collects, uses, and safeguards your personal data. Read our privacy policy to understand your rights and our data practices.";
  const lastUpdated = "2025-04-22";
  const canonicalUrl = "https://toolzer.pages.dev/privacy";

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Toolzer" />
        <meta
          property="og:image"
          content="https://toolzer.com/icons/icon-512x512.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content="https://toolzer.com/icons/icon-512x512.webp"
        />

        {/* Additional SEO tags */}
        <meta
          name="keywords"
          content="toolzer privacy policy, data collection, user rights, data security, cookies, third-party services"
        />
        <meta name="author" content="Toolzer Team" />
        <meta name="robots" content="index, follow" />

        {/* Last Modified */}
        <meta
          property="article:modified_time"
          content={`${lastUpdated}T08:26:27Z`}
        />
      </Head>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <p className="text-muted-foreground">Last updated: April 22, 2025</p>

          <h2 className="text-xl font-semibold mt-8">1. Introduction</h2>
          <p>
            At Toolzer, we respect your privacy and are committed to protecting
            your personal data. This Privacy Policy explains how we collect,
            use, and safeguard your information when you use our online tools
            and services.
          </p>

          <h2 className="text-xl font-semibold mt-8">
            2. Information We Collect
          </h2>
          <p>
            <strong>Usage Data:</strong> We collect anonymous information about
            how you use our tools, including browser type, time spent on the
            site, pages visited, and features used.
          </p>
          <p>
            <strong>Files and Content:</strong> When you use our conversion or
            processing tools, we temporarily process the files or content you
            upload. This data is automatically deleted after processing is
            complete or within 24 hours, whichever comes first.
          </p>
          <p>
            <strong>API Usage:</strong> If you use our API services, we collect
            authentication information and track API call volume for rate
            limiting purposes.
          </p>

          <h2 className="text-xl font-semibold mt-8">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our services</li>
            <li>To improve our tools based on how they're being used</li>
            <li>To monitor and prevent abuse of our services</li>
            <li>To respond to your requests or questions</li>
            <li>To comply with applicable laws and regulations</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your data
            against unauthorized access, alteration, disclosure, or destruction.
            All processed files are temporarily stored in secure, encrypted
            storage and are automatically deleted after processing.
          </p>

          <h2 className="text-xl font-semibold mt-8">
            5. Cookies and Tracking
          </h2>
          <p>
            We use essential cookies to ensure the proper functioning of our
            site. We also use analytics cookies to understand how visitors
            interact with our tools, which helps us improve them. You can
            control cookie preferences through your browser settings.
          </p>

          <h2 className="text-xl font-semibold mt-8">
            6. Third-Party Services
          </h2>
          <p>
            We may use third-party services for analytics, hosting, and other
            infrastructure needs. These services have their own privacy
            policies, and we recommend reviewing them for a complete
            understanding of how your data might be processed.
          </p>

          <h2 className="text-xl font-semibold mt-8">7. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding
            your personal data, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access your data</li>
            <li>The right to correct inaccurate data</li>
            <li>The right to request deletion of your data</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for legal, operational, or regulatory
            reasons. We will post the updated policy on this page with a revised
            "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold mt-8">9. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at{" "}
            <a
              href="mailto:privacy@toolzer.io"
              className="text-primary hover:underline"
            >
              contact.dry528@passinbox.com
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
