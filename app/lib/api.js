import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

let contentPath = path.join(process.cwd(), "blogs");

// Ultra simplified API with minimal processing
export async function getSimplifiedBlog(slug, type = "blog") {
  if (type != "blog") {
    contentPath = path.join(process.cwd(), "data", "tools");
  }
  try {
    const fullPath = path.join(contentPath, `${slug}.md`);
    console.log(fullPath);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);
    const htmlContent = await remark().use(html).process(content);

    // Return plain JS object with stringified values
    return {
      slug,
      title: String(data.title || ""),
      date: data.date ? String(data.date) : "",
      content: String(htmlContent),
      excerpt: data.excerpt ? String(data.excerpt) : "",
      coverImage: data.coverImage ? String(data.coverImage) : "",
      author: data.author ? String(data.author) : "",
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    };
  } catch (error) {
    console.error(`Error in getSimplifiedBlog for ${slug}:`, error);
    return null;
  }
}

export function getSimpleBlogSlugs(type = "blog") {
  if (type != "blog") {
    contentPath = path.join(process.cwd(), "data", "tools");
  }

  try {
    return fs
      .readdirSync(contentPath)
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({ params: { slug: file.replace(/\.md$/, "") } }));
  } catch (error) {
    console.error("Error in getSimpleBlogSlugs:", error);
    return [];
  }
}

export function getAllSimpleBlogs() {
  try {
    const slugs = fs
      .readdirSync(contentPath)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""));

    return slugs.map((slug) => {
      const fullPath = path.join(contentPath, `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      // Return only essential data without complex processing
      return {
        slug,
        title: String(data.title || ""),
        date: data.date ? String(data.date) : "",
        excerpt: data.excerpt ? String(data.excerpt) : "",
        coverImage: data.coverImage ? String(data.coverImage) : "",
        author: data.author ? String(data.author) : "",
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      };
    });
  } catch (error) {
    console.error("Error in getAllSimpleBlogs:", error);
    return [];
  }
}
