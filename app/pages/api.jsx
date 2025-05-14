import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Code,
  Key,
  Lock,
  BarChart2,
  FileJson,
  Copy,
  Check,
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

  return (
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
          <TabsList className="grid grid-cols-4 mb-8 px-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">API Overview</h2>
              <p className="mb-4">
                The Toolzer API provides programmatic access to all our tools,
                allowing you to integrate our functionality directly into your
                applications, automation workflows, or websites.
              </p>
              <p>
                Our RESTful API accepts and returns JSON, with endpoints
                designed for easy integration into any technology stack.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card/50 border border-border/50 rounded-lg p-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Simple Integration</h3>
                <p className="text-muted-foreground">
                  Standard REST architecture with JSON responses makes
                  integration straightforward from any programming language.
                </p>
              </div>

              <div className="bg-card/50 border border-border/50 rounded-lg p-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileJson className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Comprehensive Tools
                </h3>
                <p className="text-muted-foreground">
                  Access the same powerful functionality available on our
                  website, from file conversions to text processing and image
                  manipulation.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Getting Started</h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Sign up for a free API key (available soon)</li>
                <li>Read the documentation to find the endpoints you need</li>
                <li>Make API requests with your key in the header</li>
                <li>Process the JSON responses in your application</li>
              </ol>
            </div>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="authentication" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
              <p>
                All API requests require authentication using an API key. This
                key should be included in the headers of your requests.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Example Header</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() =>
                    copyToClipboard("Authorization: Bearer your_api_key_here")
                  }
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy
                </Button>
              </div>
              <pre className="text-sm bg-card p-3 rounded border border-border/50 overflow-x-auto">
                <code>Authorization: Bearer your_api_key_here</code>
              </pre>
            </div>

            <div className="bg-card/50 border border-border/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Obtaining an API Key</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                To get your API key, you'll need to register for our API
                program. During the beta period, all API keys will be issued
                manually.
              </p>

              {/* Email signup for API beta */}
              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Sign up for API beta access
                </label>
                <div className="flex gap-3">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1"
                  />
                  <Button>Request Access</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
              <p className="mb-4">
                Our API provides endpoints for all the tools available on our
                website. Here are some of the most popular endpoints:
              </p>
            </div>

            <div className="space-y-6">
              {/* HTML to Markdown Endpoint */}
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-bold">
                      POST
                    </span>
                    <code className="text-sm">
                      /api/v1/convert/html-to-markdown
                    </code>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-3">
                    Converts HTML content to Markdown format
                  </p>
                  <div className="bg-muted rounded p-3 text-xs">
                    <pre>
                      <code>{`// Request body
{
  "html": "<h1>Hello World</h1><p>This is a test</p>"
}

// Response
{
  "markdown": "# Hello World\n\nThis is a test",
  "status": "success"
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Image Processing Endpoint */}
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-bold">
                      POST
                    </span>
                    <code className="text-sm">/api/v1/image/resize</code>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-3">
                    Resizes an image to specified dimensions
                  </p>
                  <div className="bg-muted rounded p-3 text-xs">
                    <pre>
                      <code>{`// Request (multipart form data)
- file: [binary image data]
- width: 800
- height: 600
- maintain_aspect_ratio: true

// Response
{
  "success": true,
  "url": "https://api.toolzer.io/temp/resized_image.jpg",
  "expires_in": 3600
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" className="gap-2">
                  View All Endpoints
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Usage & Limits Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Usage & Limits</h2>
              <p>
                During our beta period, we're offering generous limits to help
                you integrate and test our API.
              </p>
            </div>

            <div className="bg-card/50 border border-border/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium">API Limits</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-sm font-medium">Requests per day</p>
                    <p className="text-2xl font-bold">1,000</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-sm font-medium">Requests per minute</p>
                    <p className="text-2xl font-bold">60</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium">File size limit</p>
                  <p className="text-2xl font-bold">50MB</p>
                </div>

                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-medium">Storage duration</p>
                  <p className="text-2xl font-bold">24 hours</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Best Practices</h3>
              <ul className="list-disc ml-5 space-y-2">
                <li>Include proper error handling for API responses</li>
                <li>Cache results when possible to minimize API calls</li>
                <li>Implement exponential backoff for rate limit errors</li>
                <li>Download and store processed files promptly</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* API Integration Example */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">
            Quick Implementation Example
          </h2>
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">JavaScript Example</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1"
                onClick={() =>
                  copyToClipboard(
                    `async function convertHtmlToMarkdown(htmlContent) {
  const response = await fetch('https://api.toolzer.io/v1/convert/html-to-markdown', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      html: htmlContent
    })
  });
  
  const data = await response.json();
  return data.markdown;
}`,
                  )
                }
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy
              </Button>
            </div>
            <pre className="text-sm bg-card p-3 rounded border border-border/50 overflow-x-auto">
              <code>{`async function convertHtmlToMarkdown(htmlContent) {
  const response = await fetch('https://api.toolzer.io/v1/convert/html-to-markdown', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      html: htmlContent
    })
  });
  
  const data = await response.json();
  return data.markdown;
}`}</code>
            </pre>
          </div>
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
  );
}
