import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Activity,
  AlignHorizontalSpaceBetween,
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Boxes,
  Brain,
  Braces,
  Braces as Json,
  Bug,
  BugPlay,
  Calculator,
  CheckCircle,
  CheckCircle2,
  Clock,
  Code,
  Code2,
  Coins,
  Cpu,
  Database,
  Eye,
  FileBarChart,
  FileCheck2,
  FileCode,
  FileCode2,
  FileDown,
  FileImage,
  FileLock,
  FileSearch,
  FileStack,
  FileText,
  Globe,
  HardDriveDownload,
  Hash,
  Image,
  ImageDown,
  Info,
  Instagram,
  Key,
  KeyRound,
  Lock,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Mic,
  Music2,
  Network,
  Pdf,
  Radio,
  RefreshCcw,
  Search,
  Server,
  Settings,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Terminal,
  TerminalSquare,
  Text,
  Users,
  Video,
  Volume2,
  Wand2,
  Wallet,
  Zap,
  Infinity as Infinite,
  ListTree
} from "lucide-react";
import Head from "@/components/Head";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FakePingTool from "@/components/FakePing";

export default function Home() {
  return (
    <>
      <Head
        title={"Toolzer | Every Online Tool You’ll Ever Need — Free & Fast"}
        description={
          "Toolzer brings all online tools in one place — from file converters to SEO, image editors, downloaders, and dev utilities. 100% free and fast"
        }
        featureList={[
          "No login required",
          "File conversion made easy",
          "Powerful media processing for audio, video, and images",
          "Versatile text and code utilities",
          "AI-enhanced tools for smarter workflows",
          "Seamless experience on both mobile and desktop",
        ]}
      />
      <HeroSection />
      <ToolsShowcase />
      <WhyToolzer />
      <TrustedBySection />
      <CTASection />
      <FAQSection />
    </>
  );
}

function ToolsShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  // Define tool categories directly
  const toolCategories = [ { id: "network", name: "Network & DNS Tools", tools: [ { id: "dns-resolver", name: "DNS Resolver", description: "Resolve domain to DNS records", icon: Globe, color: "blue", isPopular: true }, { id: "reverse-dns", name: "Reverse DNS Lookup", description: "Find PTR for an IP address", icon: RefreshCcw, color: "indigo" }, { id: "whois-lookup", name: "WHOIS Lookup", description: "Fetch domain/IP WHOIS data", icon: Info, color: "cyan" }, { id: "ip-geolocation", name: "IP Geolocation", description: "Map IP to country, region, ISP", icon: MapPin, color: "green" }, { id: "port-scanner", name: "Port Scanner", description: "Scan open TCP/UDP ports", icon: Shield, color: "red" }, { id: "traceroute", name: "Traceroute Analyzer", description: "Trace route to a destination IP", icon: Activity, color: "orange" }, { id: "ping", name: "Ping Utility", description: "Measure packet loss and latency", icon: Zap, color: "yellow" }, { id: "subnet-calc", name: "Subnet Calculator", description: "Calculate network info from CIDR", icon: Calculator, color: "purple" }, ], }, { id: "security", name: "Security Tools", tools: [ { id: "ssl-checker", name: "SSL Certificate Checker", description: "Inspect TLS cert details", icon: Lock, color: "emerald" }, { id: "open-port", name: "Open Port Lookup", description: "Check if a port is open", icon: TerminalSquare, color: "rose" }, { id: "http-security-headers", name: "HTTP Security Headers", description: "Scan for missing headers", icon: ShieldCheck, color: "lime" }, { id: "jwt-inspector", name: "JWT Token Inspector", description: "Decode and verify JWTs", icon: Key, color: "fuchsia" }, { id: "cert-decoder", name: "X.509 Decoder", description: "View fields from a PEM cert", icon: FileText, color: "amber" }, { id: "hash-cracker", name: "Hash Cracker", description: "Crack hashes via dictionary", icon: Bug, color: "red" }, ], }, { id: "devtools", name: "Developer Tools", tools: [ { id: "graphql-tester", name: "GraphQL Tester", description: "Send GraphQL queries & view response", icon: Code2, color: "sky" }, { id: "rest-composer", name: "REST API Composer", description: "Craft & test REST calls", icon: Braces, color: "blue" }, { id: "websocket-tester", name: "WebSocket Tester", description: "Connect & send messages", icon: Radio, color: "green" }, { id: "curl-generator", name: "cURL Generator", description: "Generate curl from request data", icon: Terminal, color: "zinc" }, { id: "jsonpath-evaluator", name: "JSONPath Evaluator", description: "Extract data from JSON", icon: FileCode2, color: "cyan" }, { id: "xpath-tester", name: "XPath Tester", description: "Evaluate XPath on XML/HTML", icon: Search, color: "yellow" }, ], }, { id: "crypto", name: "Crypto & Encoding Tools", tools: [ { id: "rsa-keygen", name: "RSA Keypair Generator", description: "Generate RSA PEM keys", icon: KeyRound, color: "amber" }, { id: "aes-tool", name: "AES Encrypt/Decrypt", description: "Run AES-CBC or GCM", icon: LockKeyhole, color: "lime" }, { id: "hash-calc", name: "Hash Calculator", description: "Generate MD5/SHA/CRC32", icon: Hash, color: "indigo" }, { id: "base-enc", name: "Base Encoder/Decoder", description: "Base64/58/32 encoding tools", icon: Text, color: "fuchsia" }, { id: "pgp-verify", name: "PGP Signature Verifier", description: "Validate PGP signed text", icon: FileLock, color: "rose" }, { id: "blockchain-decoder", name: "Blockchain Address Decoder", description: "Decode BTC/ETH address or txn", icon: Coins, color: "yellow" }, ], }, { id: "files", name: "Advanced File Tools", tools: [ { id: "binary-hex", name: "Binary/Hex Converter", description: "Convert binary ↔ hex", icon: AlignHorizontalSpaceBetween, color: "violet" }, { id: "elf-pe-parser", name: "ELF/PE Inspector", description: "Read headers of ELF/PE files", icon: FileCheck2, color: "orange" }, { id: "exif-reader", name: "EXIF Extractor", description: "Extract metadata from JPEG", icon: ImageDown, color: "green" }, { id: "disk-img-analyzer", name: "Disk Image Analyzer", description: "Parse ISO/IMG without mount", icon: HardDriveDownload, color: "slate" }, { id: "pdf-inspector", name: "PDF Inspector", description: "Explore internal PDF structure", icon: FileSearch, color: "purple" }, ], }, { id: "ai", name: "AI & ML Tools", tools: [ { id: "ai-image-enhancer", name: "AI Image Enhancer", description: "Upscale and enhance images", icon: Wand2, color: "violet", isPopular: true }, { id: "ai-summarizer", name: "AI Summarizer", description: "Summarize long articles", icon: MessageSquareText, color: "blue" }, { id: "speech-to-text", name: "Speech to Text", description: "Transcribe audio files", icon: Mic, color: "lime" }, { id: "text-to-speech", name: "Text to Speech", description: "Convert text to voice", icon: Volume2, color: "emerald" }, { id: "ai-linter", name: "AI Code Linter", description: "Lint code using ML", icon: BugPlay, color: "cyan" }, { id: "ai-vuln-scanner", name: "AI Vulnerability Scanner", description: "Detect security issues in code", icon: ShieldAlert, color: "red" }, ], }, { id: "deep-dive", name: "Deep Dive Tools", tools: [ { id: "pcap-parser", name: "PCAP Parser", description: "Analyze .pcap network captures", icon: FileBarChart, color: "blue" }, { id: "docker-analyzer", name: "Dockerfile Analyzer", description: "Suggest Dockerfile optimizations", icon: Boxes, color: "slate" }, { id: "k8s-validator", name: "Kubernetes YAML Validator", description: "Validate K8s manifests", icon: FileStack, color: "indigo" }, { id: "terraform-visualizer", name: "Terraform Visualizer", description: "Visualize Terraform plan", icon: ListTree, color: "green" }, ], }, ];



  // Total tool count for display
  const totalToolCount = toolCategories.reduce(
    (count, category) => count + category.tools.length,
    0,
  );

  // Color mappings for tool colors
  const getColorClasses = (color) => {
    const colorMap = {
      violet: { bg: "bg-violet-500/10", text: "text-violet-500" },
      blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
      indigo: { bg: "bg-indigo-500/10", text: "text-indigo-500" },
      yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
      pink: { bg: "bg-pink-500/10", text: "text-pink-500" },
      cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-500" },
      red: { bg: "bg-red-500/10", text: "text-red-500" },
      green: { bg: "bg-green-500/10", text: "text-green-500" },
      gray: { bg: "bg-gray-500/10", text: "text-gray-500" },
      lime: { bg: "bg-lime-500/10", text: "text-lime-500" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-500" },
    };
    return colorMap[color] || { bg: "bg-primary/10", text: "text-primary" };
  };

  // Tool Card Component
  const ToolCard = ({ tool, index, inView }) => {
    const Icon = tool.icon;
    const { bg, text } = getColorClasses(tool.color);
    const gradientBg = bg.replace("/10", "/40");

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative bg-card hover:bg-card/80 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        whileHover={{ y: -5 }}
      >
        {/* Card top gradient line */}
        <div className={`h-1 w-full ${gradientBg}`} />

        <div className="p-6">
          {/* Icon */}
          <div
            className={`${bg} ${text} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold mb-1">{tool.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {tool.description}
          </p>

          {/* Hover CTA */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent translate-y-14 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-end p-6">
            <Button variant="ghost" size="sm" className="gap-1">
              <span>Use Tool</span>
              <ArrowUpRight className="h-4 w-4 opacity-70" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section ref={ref} className="py-16 md:py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background opacity-80" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="container px-4 mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Powerful Tools
            </Badge>
            <span className="text-muted-foreground text-sm">
              {totalToolCount}+ free utilities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Your Digital Toolkit
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-muted-foreground text-lg"
          >
            Everything you need to create, convert, and optimize — all in one
            place.
          </motion.p>
        </div>

        {/* Tools Grid by Category */}
        <div className="space-y-16">
          {toolCategories.map((category, catIndex) => (
            <div key={category.id} className="space-y-6">
              {/* Category title */}
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.5, delay: 0.2 + catIndex * 0.1 }}
                className="text-xl font-semibold flex items-center"
              >
                <span className="w-8 h-px bg-border mr-3"></span>
                {category.name}
              </motion.h3>

              {/* Tools in this category - horizontal scroll on mobile */}
              <div className="grid grid-flow-col auto-cols-[85%] md:grid-flow-row md:auto-cols-auto md:grid-cols-3 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:overflow-visible">
                {category.tools.map((tool, toolIndex) => (
                  <div key={tool.id} className="snap-start">
                    <ToolCard tool={tool} index={toolIndex} inView={isInView} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky "ViewAll" button */}
        <div className="mt-16 flex justify-center">
          <Link href="/tools">
            <Button
              size="lg"
              className="gap-2 relative bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
            >
              <span>View All {totalToolCount}+ Tools</span>
              <ArrowRight className="h-4 w-4" />

              {/* Subtle glow effect */}
              <span className="absolute inset-0 rounded-md bg-primary/5 blur opacity-50"></span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 bg-background">
      {/* Static, stable gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
      </div>

      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          {/* Simple badge */}
          <div className="mb-6 inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            <span>Every tool you need, in one place</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Your Free All-in-One Online Toolbox
          </h1>

          <h2 className="text-lg text-muted-foreground mx-auto">
            Toolzer offers fast, free browser and API access to powerful tools for file conversion, media editing, SEO optimization, and productivity boosting.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/tools" className="block w-full">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full"
              >
                Start Exploring
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              How It Works
              <Zap className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Converters */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Converters</h3>
            <p className="text-muted-foreground mb-4">
              Transform files between formats with just a few clicks.
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              <Link href="/tools" className="flex items-center">
                <span>Explore Converters</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Media Tools */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Image className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Media Tools</h3>
            <p className="text-muted-foreground mb-4">
              Process images, videos, and audio files with ease.
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              <Link href="/tools" className="flex items-center">
                <span>Explore Media Tools</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Productivity */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Productivity</h3>
            <p className="text-muted-foreground mb-4">
              Boost your workflow with time-saving productivity tools.
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              <Link href="/tools" className="flex items-center">
                <span>Explore Productivity</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats section - Simple and stable */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <p className="text-2xl font-bold">25+</p>
              <p className="text-sm text-muted-foreground">Free Tools</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">100K+</p>
              <p className="text-sm text-muted-foreground">Monthly Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">5M+</p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />

        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Decorative elements */}
        <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              100% Free
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Free Tools for Everyone
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Toolzer is completely free to use. No login required, no usage
            limits, and no hidden fees. Our APIs will also be free during our
            initial launch period.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-left">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <path d="m8 12 3 3 6-6" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Web Tools</h3>
              <p className="text-muted-foreground mb-4">
                Access all 25+ tools directly from your browser. No sign-up or
                installation needed — just visit and start using instantly.
              </p>
              <div className="text-sm text-primary font-medium">
                • File conversions
                <br />
                • Media downloaders
                <br />
                • Text & SEO utilities
                <br />• Developer tools
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-left">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M4 17V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2Z" />
                  <path d="m18 7-7.5 6L3 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">API Access</h3>
              <p className="text-muted-foreground mb-4">
                Integrate our tools into your workflows and applications. All
                APIs will be free during our beta period.
              </p>
              <div className="text-sm text-primary font-medium">
                • Simple REST endpoints
                <br />
                • Comprehensive documentation
                <br />
                • Rate limits apply
                <br />• Register for an API key
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                Try a Tool
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 11-3-3m0 0-3 3m3-3v8" />
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                </svg>
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              Explore API Access
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                Coming Soon
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient with pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />

        {/* Animated dots pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        {/* Glowing orb decorations */}
        <div className="absolute top-20 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left column: Text and CTA buttons */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-6 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Start Using Toolzer Today
              </h2>

              <p className="text-xl text-muted-foreground">
                No logins. No installs. Just powerful tools that work — right in
                your browser or via API.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/tools">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  Try a Tool
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-zap"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </Button>
              </Link>

              <Link href="/tools">
                <Button size="lg" variant="secondary" className="gap-2">
                  Browse All Tools
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-grid"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </Button>
              </Link>

              <Link href="/api" className="block w-full">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore API Docs
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-code"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          <FakePingTool />
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
        <div className="absolute right-10 bottom-40 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Reliable tools for modern teams
          </h2>
          <p className="text-muted-foreground text-lg">
            Trusted by thousands of developers, creators, and small teams
            building projects that matter.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              number: "10K+",
              label: "Active Users",
              icon: <CheckCircle className="h-6 w-6 text-primary" />,
            },
            {
              number: "24/7",
              label: "Monitoring & Support",
              icon: <Clock className="h-6 w-6 text-primary" />,
            },
            {
              number: "Fast & Simple",
              label: "Optimized Performance",
              icon: <Zap className="h-6 w-6 text-primary" />,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold mb-1">{item.number}</h3>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/tools" className="block w-full">
            <Button size="lg" className="gap-2 w-full">
              Explore Tools
            </Button>
          </Link>
          <Link href="/docs" className="block w-full">
            <Button size="lg" variant="outline" className="gap-2 w-full">
              View Documentation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyToolzer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const benefitVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute right-0 top-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute left-0 bottom-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Why Toolzer?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Powerful tools for everyone — whether you're automating workflows or
            just need a quick conversion.
          </motion.p>
        </div>

        {/* Two Cards Side by Side */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* For Everyone Card */}
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold">For Everyone</h3>
              </div>

              <ul className="space-y-5">
                {[
                  {
                    icon: <Clock className="h-5 w-5 text-blue-500" />,
                    text: "No sign-up required",
                  },
                  {
                    icon: <CheckCircle2 className="h-5 w-5 text-blue-500" />,
                    text: "Fast, reliable results",
                  },
                  {
                    icon: <Smartphone className="h-5 w-5 text-blue-500" />,
                    text: "Mobile-friendly & simple UI",
                  },
                  {
                    icon: <AppWindow className="h-5 w-5 text-blue-500" />,
                    text: "25+ tools in one place",
                  },
                ].map((benefit, i) => (
                  <motion.li
                    key={benefit.text}
                    custom={i}
                    variants={benefitVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      {benefit.icon}
                    </div>
                    <span className="text-base">{benefit.text}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* For Developers Card */}
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Code className="h-5 w-5 text-violet-500" />
                </div>
                <h3 className="text-2xl font-semibold">For Developers</h3>
              </div>

              <ul className="space-y-5">
                {[
                  {
                    icon: <Server className="h-5 w-5 text-violet-500" />,
                    text: "Simple REST API access",
                  },
                  {
                    icon: <Infinite className="h-5 w-5 text-violet-500" />,
                    text: "1M free requests per month",
                  },
                  {
                    icon: <Json className="h-5 w-5 text-violet-500" />,
                    text: "JSON responses & serverless support",
                  },
                  {
                    icon: <Bot className="h-5 w-5 text-violet-500" />,
                    text: "Perfect for automation, bots, & SaaS apps",
                  },
                ].map((benefit, i) => (
                  <motion.li
                    key={benefit.text}
                    custom={i}
                    variants={benefitVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      {benefit.icon}
                    </div>
                    <span className="text-base">{benefit.text}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/tools" className="block w-full">
            <Button
              size="lg"
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              Get Started
              <Zap className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/api" className="block w-full">
            <Button size="lg" variant="outline" className="w-full gap-2">
              View API Docs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
