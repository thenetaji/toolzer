import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";

export default function BlogCard({ post }) {
  const { frontmatter, slug } = post;

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full">
        <Image
          src={frontmatter.coverImage || "/images/default.png"}
          alt={frontmatter.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <CardContent className="p-5 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {frontmatter.categories?.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="text-xs md:text-sm"
            >
              {category}
            </Badge>
          ))}
        </div>
        <Link href={`/blog/${slug}`} className="no-underline">
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
            {frontmatter.title}
          </h3>
        </Link>
        <p className="text-muted-foreground mb-4 text-sm md:text-base line-clamp-3">
          {frontmatter.excerpt ||
            (frontmatter.content &&
              frontmatter.content.substring(0, 150) + "...")}
        </p>
        <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-4 mt-auto">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
            <span>
              {formatDistanceToNow(new Date(frontmatter.date), {
                addSuffix: true,
              })}
            </span>
          </div>
          {frontmatter.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span>{frontmatter.readingTime} min read</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Link href={`/blog/${slug}`}>
          <Button variant="outline" className="text-sm md:text-base">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
