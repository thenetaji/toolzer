import ToolContainer from "@/components/ToolContainer";
import ToolContent from "@/components/ToolContent";
import { getSimplifiedBlog, getSimpleBlogSlugs } from "@/lib/api";
import ImageTool from "@/components/tools/image";

import Head from "next/head";

export default function Tool({ params, blog }) {
  const pageUrl = `https://toolzer.pages.dev/tools/image/${blog.slug}`;
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{blog.title}</title>
        <meta name="description" content={blog.description} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Toolzer" />
        {blog.featuredImage && (
          <meta property="og:image" content={blog.featuredImage} />
        )}

        {/* Twitter */}
        <meta
          name="twitter:card"
          content={blog.featuredImage ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        {blog.featuredImage && (
          <meta name="twitter:image" content={blog.featuredImage} />
        )}
      </Head>
      <ToolContainer
        tool={
          <ImageTool
            config={{
              width: 800,
              height: 600,
              percentage: 50,
              targetSize: 100,
              quality: 90,
              format: "jpeg",
              maintainAspectRatio: true,
            }}
          />
        }
        title={blog.title}
        content={<ToolContent />}
      />

      <ToolContent blog={blog} />
    </>
  );
}

export async function getStaticPaths() {
  try {
    const paths = getSimpleBlogSlugs("tool");

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
    const blog = await getSimplifiedBlog(params.slug, "tool");

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
