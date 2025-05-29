import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CURRENT_YEAR = "2025";

const mainLinks = [
  { name: "Tools", href: "/tools" },
  { name: "About", href: "/about" },
  { name: "API", href: "/dev-api" },
  { name: "Contact", href: "/contact" },
];

const resourceLinks = [
  { name: "Documentation", href: "/docs" },
  { name: "Help Center", href: "/help" },
  { name: "Blog", href: "/blog" },
];

const legalLinks = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: <Github className="h-5 w-5" />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: <Twitter className="h-5 w-5" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: <Youtube className="h-5 w-5" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-background/95 border-t border-border/40 pt-12 pb-6">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-background rounded-full p-1 flex items-center justify-center"></div>
              </div>
              <span className="font-bold text-transparent text-xl bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Toolzer
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Create beautiful, modern web experiences with our premium tools
              and components.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors duration-200"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Main Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Navigation</h3>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center group"
                  >
                    <ArrowRight className="mr-1 h-3 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center group"
                  >
                    <ArrowRight className="mr-1 h-3 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <div className="pt-2">
              <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-50" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted-foreground">
            © {CURRENT_YEAR} Toolzer. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
