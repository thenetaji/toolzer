import Head from "@/components/Head";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { getSimplifiedBlog, getSimpleBlogSlugs } from "@/lib/api";

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
import styles from "./blog.module.css";

export default function BlogPost({ blog }) {
  if (!blog) {
    return (<> 
    <p> Blog not found</p>
    </>)
  }
  
  return (
    <>
      <div className="container max-w-3xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/blog" className="inline-block">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-base"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to all blogs
            </Button>
          </Link>
        </div>

        {/* Blog Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {blog.title}
          </h1>

          {blog.date && (
            <p className="text-base text-muted-foreground mb-6">
              {format(new Date(blog.date), "MMMM d, yyyy")}
              {blog.author && ` • ${blog.author}`}
            </p>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
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
          <div className="mb-10">
            <img
              src={blog.featuredImage}
              alt={`Featured image for ${blog.title}`}
              className="w-full h-auto object-cover rounded-lg"
              style={{ maxHeight: "500px" }}
            />
          </div>
        )}

        {/* Blog Content */}
        <div className={`${styles.blogContent} mb-12`}>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <Separator className="my-12" />

        {/* CTA Section */}
        <Card className="mt-12 border shadow-md bg-card">
          <CardHeader className="text-center space-y-4 pb-4">
            <CardTitle className="text-3xl font-bold">Try the Tool</CardTitle>
            <CardDescription className="max-w-md mx-auto text-base">
              Ready to see what our tool can do for you? Click below to get
              started!
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center py-4">
            <Link href={blog.toolLink ? `/tool${blog.toolLink}` : "/tool"}>
              <Button size="lg" className="px-10 py-4 text-lg font-medium">
                Try It Now
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const paths = getSimpleBlogSlugs();

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const blog = await getSimplifiedBlog(params.slug);

    if (!blog) {
      return { notFound: true };
    }

    return {
      props: {
        blog: JSON.parse(JSON.stringify(blog)),
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
