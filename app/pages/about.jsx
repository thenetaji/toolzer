import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Globe,
  LightbulbIcon,
  Rocket,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

export default function About() {
  const pageTitle = "About Toolzer | Empowering Digital Creators";
  const pageDescription =
    "Toolzer provides simple yet powerful tools to optimize digital workflows for creators and developers. Learn about our mission, values, and the team behind our innovative platform.";
  const lastUpdated = "2025-04-22";
  const canonicalUrl = "https://toolzer.pages.dev/about";

  return (
    <>
      <Head>
        {/* Primary meta tags */}
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
          content="https://toolzer.com/images/about-page-social.jpg"
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
          content="toolzer, digital tools, web utilities, online converters, developer tools, creators, digital workflows"
        />
        <meta name="author" content="Toolzer Team" />
        <meta name="robots" content="index, follow" />

        {/* Last modified time */}
        <meta
          property="article:modified_time"
          content={`${lastUpdated}T08:33:44Z`}
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

        <div>
          <h1 className="text-4xl font-bold mb-6">About Toolzer</h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-10">
              Empowering creators and developers with simple, powerful tools to
              optimize their digital workflows.
            </p>

            {/* Our Mission */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Our Mission</h2>
              </div>

              <p>
                At Toolzer, we believe digital tools should be accessible to
                everyone. Our mission is to create a platform where anyone can
                access powerful utilities without technical barriers,
                subscriptions, or complex software installations.
              </p>
              <p>
                We're building a comprehensive toolkit that simplifies common
                digital tasks while providing the flexibility developers need to
                integrate these capabilities into their own workflows.
              </p>
            </div>

            {/* Our Story */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <LightbulbIcon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Our Story</h2>
              </div>

              <p>
                Toolzer began in 2023 when our founder, tired of bouncing
                between dozens of single-purpose websites for simple tasks like
                converting files or generating metadata, decided to build a
                unified solution. What started as a personal project quickly
                grew into a platform serving thousands of users.
              </p>
              <p>
                Today, Toolzer continues to evolve based on user feedback and
                needs. We're committed to keeping our core tools free while
                expanding our offerings to support creators, marketers,
                developers, and anyone who works with digital content.
              </p>
            </div>

            {/* How Toolzer Works */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">How Toolzer Works</h2>
              </div>

              <p>
                Our platform uses cloud-based processing to handle all
                conversions, generations, and transformations. When you use a
                Toolzer utility, your content is:
              </p>

              <ol>
                <li>
                  <strong>Securely uploaded</strong> to our temporary storage
                </li>
                <li>
                  <strong>Processed</strong> using specialized algorithms
                  optimized for speed and accuracy
                </li>
                <li>
                  <strong>Returned</strong> to you with the results
                </li>
                <li>
                  <strong>Automatically deleted</strong> from our servers within
                  24 hours
                </li>
              </ol>

              <p>
                For developers, we provide API access to the same powerful
                processing capabilities, making it easy to integrate Toolzer
                functions into custom applications, automation workflows, or
                websites.
              </p>
            </div>

            {/* Core Values */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Core Values</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                <div className="bg-card/50 p-5 rounded-lg border border-border/50">
                  <h3 className="font-medium mb-2">Accessibility</h3>
                  <p className="text-muted-foreground text-sm">
                    We believe powerful tools should be available to everyone,
                    regardless of technical ability or budget.
                  </p>
                </div>

                <div className="bg-card/50 p-5 rounded-lg border border-border/50">
                  <h3 className="font-medium mb-2">Privacy</h3>
                  <p className="text-muted-foreground text-sm">
                    Your data belongs to you. We process what's needed, then
                    delete it promptly.
                  </p>
                </div>

                <div className="bg-card/50 p-5 rounded-lg border border-border/50">
                  <h3 className="font-medium mb-2">Simplicity</h3>
                  <p className="text-muted-foreground text-sm">
                    Complex results shouldn't require complex interfaces. We
                    strive for intuitive design.
                  </p>
                </div>

                <div className="bg-card/50 p-5 rounded-lg border border-border/50">
                  <h3 className="font-medium mb-2">Reliability</h3>
                  <p className="text-muted-foreground text-sm">
                    Our tools should work consistently and correctly, every
                    single time.
                  </p>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Our Team</h2>
              </div>

              <p>
                Toolzer is built by a small team of passionate developers and
                designers who believe in making technology more accessible.
                We're distributed across the globe, working together to create
                tools that solve real problems.
              </p>

              <p>
                Our diverse backgrounds in web development, AI, design, and
                product management help us approach problems from different
                angles, creating solutions that work for everyone.
              </p>
            </div>

            {/* Get In Touch */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Get Involved</h2>
              </div>

              <p>
                We're always looking for feedback, suggestions, and
                collaborations to make Toolzer better.
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <Button className="gap-2">
                  Try Our Tools
                  <Sparkles className="h-4 w-4" />
                </Button>

                <Link href="/contact">
                  <Button variant="outline" className="gap-2">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-16 border-t pt-6">
          <p>Last Updated: 2025-04-22 08:33:44 (UTC)</p>
          <p>Maintained by @thenetaji</p>
        </div>
      </div>
    </>
  );
}
