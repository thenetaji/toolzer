import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Moon,
  Sun,
  Rocket,
  Zap,
  Code,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SiteLogo from "../assets/logo.png";

const SITE_NAME = "Toolzer";

const navItems = [
  { name: "Tools", href: "/tools", icon: <Rocket className="w-4 h-4 mr-2" /> },
  { name: "About", href: "/about", icon: <Zap className="w-4 h-4 mr-2" /> },
  { name: "API", href: "/api", icon: <Code className="w-4 h-4 mr-2" /> },
  {
    name: "Contact",
    href: "/contact",
    icon: <MessageCircle className="w-4 h-4 mr-2" />,
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`sticky top-0 z-50 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg"
          : "bg-background/40 backdrop-blur-md"
      } border-b border-border/40 transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-1 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-background rounded-full p-1 flex items-center justify-center">
                  <img
                    src={SiteLogo}
                    alt={SITE_NAME}
                    className="h-6 w-6 rounded"
                  />
                </div>
              </div>

              <motion.span
                className="font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-primary to-purple-600"
                animate={{
                  backgroundPosition: isHovering ? ["0%", "100%"] : ["0%"],
                  backgroundSize: "200%",
                }}
                transition={{
                  duration: 1,
                  repeat: isHovering ? Infinity : 0,
                  repeatType: "reverse",
                }}
              >
                {SITE_NAME}
              </motion.span>
            </Link>

            <Badge
              variant="outline"
              className="hidden md:flex ml-2 bg-primary/10 text-xs"
            >
              BETA
            </Badge>
          </motion.div>
          <div className="flex items-center">
            {/* Theme Toggle for Desktop */}
            <motion.div whileTap={{ scale: 0.9 }} className="mr-2">
              <Toggle
                pressed={theme === "dark"}
                onPressedChange={toggleTheme}
                size="sm"
                className="bg-muted/50 border-border/0 data-[state=on]:bg-primary/20"
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Sun className="h-4 w-4 text-yellow-500" />
                )}
              </Toggle>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded-full">
              {navItems.map((item, index) => (
                <TooltipProvider key={item.href}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <motion.div
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        whileHover={{ y: -2 }}
                        animate={
                          activeIndex === index ? { scale: 1.1 } : { scale: 1 }
                        }
                      >
                        <Link to={item.href} className="flex items-center">
                          <Button
                            variant={
                              activeIndex === index ? "default" : "ghost"
                            }
                            size="sm"
                            className="relative overflow-hidden group rounded-full px-1"
                          >
                            {item.icon}
                            <span className="relative">
                              {item.name}
                              <motion.span
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                                initial={{ scaleX: 0 }}
                                animate={{
                                  scaleX: activeIndex === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </span>

                            {/* Gradient Hover Effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                              initial={{ opacity: 0 }}
                              animate={
                                activeIndex === index
                                  ? { opacity: 1 }
                                  : { opacity: 0 }
                              }
                              transition={{ duration: 0.3 }}
                            />
                          </Button>
                        </Link>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-background/95 backdrop-blur-lg border border-border/50"
                    >
                      <p>Go to {item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <motion.div whileTap={{ scale: 0.9 }} className="md:hidden">
                  <Button variant="ghost" size="icon" className="relative ml-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-purple-600/40 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-200"></div>
                    <Menu className="h-5 w-5 text-primary" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-background/95 backdrop-blur-xl border-l border-border/40 pr-0"
              >
                <SheetHeader className="flex flex-row items-center justify-between">
                  <SheetTitle className="flex items-center">
                    <img
                      src={SiteLogo}
                      alt={SITE_NAME}
                      className="h-5 w-5 mr-2 rounded"
                    />
                    <span className="font-bold text-transparent text-lg bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                      {SITE_NAME}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-1 mt-6 pr-6">
                  <AnimatePresence>
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start mb-1 group hover:bg-primary/10"
                        >
                          <Link
                            to={item.href}
                            className="flex items-center w-full"
                          >
                            <div className="mr-3 p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              {item.icon}
                            </div>
                            {item.name}
                          </Link>
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
