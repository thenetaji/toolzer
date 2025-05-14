import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { getSimplifiedBlog, getSimpleBlogSlugs } from "@/lib/api";
import { cn } from "@/lib/utils";

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Custom blog styles
import styles from "@/styles/blog-post.module.css";

export default function EnhancedBlogPost({ blog }) {
  if (!blog) {
    return (
      <div className="container max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Blog not found</h1>
        <Link href="/blog" className="inline-block">
          <Button variant="ghost" className="flex items-center gap-2 text-base">
            <ChevronLeft className="h-5 w-5" />
            Back to all blogs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-6 py-12">
      {/* Navigation */}
      <div className="mb-10">
        <Link href="/blog" className="inline-block">
          <Button variant="ghost" className="flex items-center gap-2 text-base">
            <ChevronLeft className="h-5 w-5" />
            Back to all blogs
          </Button>
        </Link>
      </div>

      {/* Blog Header */}
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {blog.title}
        </h1>

        {blog.date && (
          <p className="text-base text-muted-foreground">
            {format(new Date(blog.date), "MMMM d, yyyy")}
            {blog.author && ` • ${blog.author}`}
          </p>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {blog.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Featured Image (if available) */}
      {blog.featuredImage && (
        <div className="mb-10 rounded-lg overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={`Featured image for ${blog.title}`}
            className="w-full h-auto object-cover"
            style={{ maxHeight: "500px" }}
          />
        </div>
      )}

      {/* Blog Content with custom styling */}
      <article
        className={cn(
          "prose dark:prose-invert max-w-none mb-16",
          styles.blogContent,
        )}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <Separator className="my-12" />

      {/* CTA Section */}
      <Card className="mt-12 border shadow-md bg-card">
        <CardHeader className="text-center space-y-4 pb-4">
          <CardTitle className="text-3xl font-bold">Try Our Tool</CardTitle>
          <CardDescription className="max-w-md mx-auto text-base">
            Ready to see what our tool can do for you? Click below to get
            started!
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center py-8">
          <Link href="/tool">
            <Button size="lg" className="px-10 py-6 text-lg font-medium">
              Try It Now
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const paths = getSimpleBlogSlugs();
    console.log(`Enhanced blog post: Found ${paths.length} paths`);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error in enhanced blog post getStaticPaths:", error);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  try {
    const blog = await getSimplifiedBlog(params.slug);
    console.log(`Enhanced blog post: Processing slug ${params.slug}`);

    if (!blog) {
      return { notFound: true };
    }

    return {
      props: {
        blog: JSON.parse(JSON.stringify(blog)), // Force serialization
      },
    };
  } catch (error) {
    console.error(
      `Error in enhanced blog post getStaticProps for ${params.slug}:`,
      error,
    );
    return { notFound: true };
  }
}
