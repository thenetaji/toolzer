import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Key,
  ChevronRight,
  Clock,
} from "lucide-react";

export default function API() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageTitle = "Toolzer API | Integrate Powerful Tools into Your Applications";
  const pageDescription =
    "Access Toolzer's API to integrate powerful tools like file conversions, text processing, and image manipulation into your own applications and workflows.";
  const lastUpdated = "2025-04-22";
  const canonicalUrl = "https://toolzer.com/dev-api";
  
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
        <meta name="keywords" content="toolzer api, developer tools, file conversion api, text processing api, image manipulation api, software integration" />
        <meta name="author" content="Toolzer Team" />
        <meta name="robots" content="index, follow" />

        {/* Last Modified */}
        <meta property="article:modified_time" content={`${lastUpdated}T08:33:44Z`} />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Toolzer API</h1>
              <p className="text-xl text-muted-foreground">
                Integrate our tools directly into your applications
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="gap-2">
                Get API Key
                <Key className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                Full Documentation
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* API Coming Soon Banner */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8 flex items-center gap-4">
            <div className="bg-primary/20 rounded-full p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">API Access Coming Soon</p>
              <p className="text-sm text-muted-foreground">
                Our API is currently in beta. Sign up below to get early access.
              </p>
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-10"
          >
            {/* TabsList and TabsContent rendering */}
          </Tabs>

          {/* API Integration Example */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">
              Quick Implementation Example
            </h2>
            {/* Example JavaScript Code */}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Sign up for early access to our API. During our beta period, we're
              offering extended limits and personalized support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Request API Access
                <Key className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Read Documentation
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-16 max-w-5xl mx-auto border-t pt-6">
          <p>Last Updated: 2025-04-22 08:33:44 (UTC)</p>
          <p>Maintained by @thenetaji</p>
        </div>
      </div>
    </>
  );
}