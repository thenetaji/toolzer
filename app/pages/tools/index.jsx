import React, { useState, useEffect } from "react";
import Head from "@/components/Head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  ArrowRight,
  FileSymlink,
  ImageIcon,
  Type,
  Code2,
  Wand2,
  Download,
  FileType,
  FileText,
  FileImage,
  FileBadge,
  Table,
  ImageDown,
  Minimize2,
  Video,
  Scissors,
  Music,
  Edit3,
  GitCompare,
  Tag,
  AlignJustify,
  Braces,
  BoxSelect,
  FileCode,
  FileCode2,
  Binary,
  Key,
  ImagePlus,
  FileDigit,
  FileEdit,
  Volume2,
  Instagram,
  Youtube,
  Music2,
  Twitter,
  Network,
  DollarSign,
} from "lucide-react";
import toolsData from "@/data/toolList.json";

// Map icon names to Lucide components
const iconMap = {
  FileSymlink,
  ImageIcon,
  Type,
  Code2,
  Wand2,
  Download,
  FileType,
  FileText,
  FileImage,
  FileBadge,
  Table,
  ImageDown,
  Minimize2,
  Video,
  Scissors,
  Music,
  Edit3,
  GitCompare,
  Tag,
  AlignJustify,
  Braces,
  BoxSelect,
  FileCode,
  FileCode2,
  Binary,
  Key,
  ImagePlus,
  FileDigit,
  FileEdit,
  Volume2,
  Instagram,
  Youtube,
  Music2,
  Twitter,
  Network,
  DollarSign,
};

// Map category IDs to display names and icons
const categoryConfig = {
  image: {
    name: "Image Tools",
    description: "Tools for image editing, resizing, and manipulation",
    icon: "ImageIcon",
  },
  networking: {
    name: "Networking Tools",
    description: "Tools for networking, DNS, and connectivity diagnostics",
    icon: "Network",
  },
  finance: {
    name: "Finance Tools",
    description: "Tools for financial calculations and analysis",
    icon: "DollarSign",
  },
};

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredTools, setFilteredTools] = useState([]);
  const [allTools, setAllTools] = useState([]);
  const [categories, setCategories] = useState([]);

  // Process data on component mount
  useEffect(() => {
    // Get category keys from the tools data
    const categoryKeys = Object.keys(toolsData).filter((key) =>
      Array.isArray(toolsData[key]),
    );

    // Create categories array
    const categoriesArray = categoryKeys.map((key) => ({
      id: key,
      name:
        categoryConfig[key]?.name || key.charAt(0).toUpperCase() + key.slice(1),
      description: categoryConfig[key]?.description || `Tools for ${key}`,
      icon: categoryConfig[key]?.icon || "FileSymlink",
    }));

    // Transform tools from all categories into a flat array
    const allToolsArray = categoryKeys.flatMap((category) =>
      toolsData[category].map((tool) => ({
        id: tool.slug,
        name: tool.title,
        description: tool.description,
        url: `/tools/${category}/${tool.slug}`,
        category: category,
        icon: categoryConfig[category]?.icon || "FileSymlink",
        isPopular: tool.tags?.includes("popular") || false,
        tags: tool.tags || [],
      })),
    );

    setCategories(categoriesArray);
    setAllTools(allToolsArray);
    setFilteredTools(allToolsArray);
  }, []);

  // Filter tools based on search query and active category
  useEffect(() => {
    let filtered = [...allTools];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((tool) => tool.category === activeCategory);
    }

    setFilteredTools(filtered);
  }, [searchQuery, activeCategory, allTools]);

  // Get tools by category for each tab content
  const getToolsByCategory = (categoryId) => {
    return filteredTools.filter((tool) => tool.category === categoryId);
  };

  // Calculate popular tools
  const popularTools = allTools.filter((tool) => tool.isPopular);

  return (
    <>
      <Head
        title={"Tools | Find the Perfect Tool for Your Task"}
        description={
          "Toolzer is a free toolkit with smart utilities for developers, creators, and students—convert, format, edit, and get things done faster."
        }
        pageUrl={"/tools"}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl font-bold mb-4">All Tools</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find the perfect tool for your task from our collection of{" "}
            {allTools.length} free utilities
          </p>

          {/* Search bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              placeholder="Search for tools..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Popular tools section */}
          {!searchQuery &&
            activeCategory === "all" &&
            popularTools.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h2 className="text-2xl font-semibold">Popular Tools</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularTools.slice(0, 6).map((tool) => {
                    const Icon = iconMap[tool.icon];
                    return (
                      <Link href={tool.url} key={tool.id}>
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="bg-card/80 hover:bg-card border border-border/50 rounded-lg p-4 h-full flex flex-col"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              {Icon && (
                                <Icon className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{tool.name}</p>
                              <Badge variant="secondary" className="text-xs">
                                {
                                  categories.find((c) => c.id === tool.category)
                                    ?.name
                                }
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground flex-grow">
                            {tool.description}
                          </p>
                          <div className="flex justify-end mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-xs"
                            >
                              Use Tool
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Category tabs */}
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            <div className="mb-6 overflow-x-auto">
              <TabsList className="inline-flex min-w-max">
                <TabsTrigger value="all" className="px-4">
                  All Tools
                </TabsTrigger>
                {categories.map((category) => {
                  const Icon = iconMap[category.icon];
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="px-4 flex items-center gap-2"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* All tools tab */}
            <TabsContent value="all">
              {filteredTools.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6 text-center">
                    <p>No tools found matching your search.</p>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  {/* Group by category when in "All" tab */}
                  {categories.map((category) => {
                    const categoryTools = getToolsByCategory(category.id);

                    if (categoryTools.length === 0) return null;

                    return (
                      <div key={category.id} className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                          {/* Category icon */}
                          {(() => {
                            const Icon = iconMap[category.icon];
                            return Icon ? (
                              <Icon className="h-5 w-5 text-primary" />
                            ) : null;
                          })()}
                          <h2 className="text-xl font-semibold">
                            {category.name}
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categoryTools.map((tool) => {
                            const Icon = iconMap[tool.icon];
                            return (
                              <Link href={tool.url} key={tool.id}>
                                <motion.div
                                  whileHover={{ y: -5 }}
                                  className="bg-card/80 hover:bg-card border border-border/50 rounded-lg p-4 h-full flex flex-col"
                                >
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                      {Icon && (
                                        <Icon className="h-5 w-5 text-primary" />
                                      )}
                                    </div>
                                    <p className="font-semibold">{tool.name}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground flex-grow">
                                    {tool.description}
                                  </p>
                                  <div className="flex justify-end mt-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-1 text-xs"
                                    >
                                      Use Tool
                                      <ArrowRight className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </motion.div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Category-specific tabs */}
            {categories.map((category) => {
              const categoryTools = getToolsByCategory(category.id);

              return (
                <TabsContent key={category.id} value={category.id}>
                  {categoryTools.length === 0 ? (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6 text-center">
                        <p>No tools found matching your search.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-6">
                        {category.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryTools.map((tool) => {
                          const Icon = iconMap[tool.icon];
                          return (
                            <Link href={tool.url} key={tool.id}>
                              <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-card/80 hover:bg-card border border-border/50 rounded-lg p-4 h-full flex flex-col"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {Icon && (
                                      <Icon className="h-5 w-5 text-primary" />
                                    )}
                                  </div>
                                  <p className="font-semibold">{tool.name}</p>
                                </div>
                                <p className="text-sm text-muted-foreground flex-grow">
                                  {tool.description}
                                </p>
                                <div className="flex justify-end mt-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-xs"
                                  >
                                    Use Tool
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </div>
                              </motion.div>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
}
