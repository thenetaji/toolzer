"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import toolData from "@/data/toolList.json";
import Link from "next/link";

// Custom hook for media query
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function SimilarTools({ tags, toolType }) {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Get similar tools by matching tags and exclude the one which are same same
  const similarTools = toolData[toolType].filter((tool) =>
    tags.some((tag) => tool.tags.includes(tag)),
  );

  // Display 5 tools on desktop, 3 on mobile
  const displayCount = isDesktop ? 5 : 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5" />
          <h2 className="text-xl font-bold">Similar Tools</h2>
        </div>
        <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5" />
        <h2 className="text-xl font-bold">Similar Tools</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {similarTools.slice(0, displayCount).map((tool) => (
          <Card
            key={tool.slug}
            className="h-full hover:shadow-md transition-shadow"
          >
            <Link href={`/tools/${toolType}/${tool.slug}`}>
              <CardHeader>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {tool.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
