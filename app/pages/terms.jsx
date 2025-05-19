import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  const pageTitle = "Terms of Service | Toolzer";
  const pageDescription =
    "Review Toolzer's terms of service to understand your responsibilities, our policies, and the rules for using our tools and services.";
  const lastUpdated = "2025-04-22";
  const canonicalUrl = "https://toolzer.com/terms"

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
        <meta property="og:image" content="https://toolzer.com/icons/icon-512x512.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://toolzer.com/icons/icon-512x512.webp" />

        {/* Additional SEO tags */}
        <meta name="keywords" content="toolzer terms of service, user obligations, prohibited content, API usage, liability, service policies" />
        <meta name="author" content="Toolzer Team" />
        <meta name="robots" content="index, follow" />

        {/* Last Modified */}
        <meta property="article:modified_time" content={`${lastUpdated}T08:26:27Z`} />
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
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <p className="text-muted-foreground">Last updated: April 22, 2025</p>

          <h2 className="text-xl font-semibold mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Toolzer's website, tools, or API services, you
            agree to be bound by these Terms of Service. If you disagree with any
            part of these terms, you may not access or use our services.
          </p>

          <h2 className="text-xl font-semibold mt-8">
            2. Description of Services
          </h2>
          <p>
            Toolzer provides various online tools for file conversion, media
            processing, text manipulation, and other utility functions. We also
            offer API access to these tools for developers. All services are
            provided on an "as is" and "as available" basis.
          </p>

          <h2 className="text-xl font-semibold mt-8">3. User Obligations</h2>
          <p>When using our services, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate information when required</li>
            <li>Use the services only for lawful purposes</li>
            <li>
              Not attempt to interfere with, disrupt, or gain unauthorized access
              to our services
            </li>
            <li>
              Not use automated methods to access or use our services beyond the
              provided API
            </li>
            <li>
              Not circumvent any rate limits or usage restrictions we implement
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">4. Intellectual Property</h2>
          <p>
            The Toolzer name, logo, website design, and tool interfaces are the
            intellectual property of Toolzer and are protected by copyright and
            trademark laws. Our code, algorithms, and infrastructure remain our
            exclusive property.
          </p>
          <p>
            You retain full ownership of your content that you process using our
            tools. We claim no rights to the files or data you submit.
          </p>

          <h2 className="text-xl font-semibold mt-8">5. API Usage</h2>
          <p>If you use our API services, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Register for and use a valid API key if required</li>
            <li>Comply with any rate limits and usage restrictions</li>
            <li>Not share your API credentials with third parties</li>
            <li>
              Not mask or hide the fact that your application is using Toolzer's
              services
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Toolzer shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages resulting from your use or inability to use our services.
          </p>
          <p>
            We do not guarantee that our services will be uninterrupted, secure,
            or error-free. You use our tools at your own risk and discretion.
          </p>

          <h2 className="text-xl font-semibold mt-8">7. Prohibited Content</h2>
          <p>You may not use our services to process or distribute:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Content that infringes on intellectual property rights</li>
            <li>Illegal, harmful, threatening, or discriminatory content</li>
            <li>Malware, spyware, or other malicious code</li>
            <li>Content that violates any person's privacy or personal rights</li>
            <li>Material that exploits children or minors in any way</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. We
            will provide notice of significant changes by posting the updated
            terms on our website with a new "Last updated" date. Your continued
            use of our services after such changes constitutes your acceptance of
            the new terms.
          </p>

          <h2 className="text-xl font-semibold mt-8">9. Termination</h2>
          <p>
            We may terminate or suspend access to our services immediately,
            without prior notice, for conduct that we believe violates these Terms
            of Service or is harmful to other users of our services, us, or third
            parties, or for any other reason at our discretion.
          </p>

          <h2 className="text-xl font-semibold mt-8">11. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:legal@toolzer.io"
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