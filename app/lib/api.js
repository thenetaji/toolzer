import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const root = process.cwd();

/**
 * getting single md file for only tool rendering
 */
export const getMdContent = async (contentPath, type = null) => {
  try {
    let fullPath = path.join(root, "data", "tool-content", contentPath);
    if (type == "blog") {
      fullPath = path.join(root, "blogs", `${contentPath}.md`);
    }
    if (!contentPath) console.error("path is empty");

    const fileContents = fs.readFileSync(fullPath, "utf8");
    if (!fileContents) console.error("tool content is empty");

    const { data, content } = matter(fileContents);

    const htmlContent = await remark().use(html).process(content);

    return {
      data,
      content: String(htmlContent),
    };
  } catch (err) {
    console.error("Error in getting tool content", err);
    return null;
  }
};

/**
 * get all slug for blog rendering for getStaticPaths
 */
export async function getAllBlogSlug() {
  try {
    const blogDir = path.join(root, "blogs");

    return fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({ params: { slug: file.replace(/\.md$/, "") } }));
  } catch (err) {
    console.error("Error while getting  all blog slug", err);
  }
}

/**
 * get all blog content for blog index page rendering
 */
export async function getAllBlogs() {
  try {
    const blogsDir = path.join(root, "blogs");
    const files = fs.readdirSync(blogsDir);

    const blogs = await Promise.all(
      files.map(async (filename) => {
        const fullPath = path.join(blogsDir, filename);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        const { data, content } = matter(fileContents);
        const htmlContent = await remark().use(html).process(content);

        return {
          slug: filename.replace(/\.md$/, ""),
          data,
          content: htmlContent.toString(),
        };
      }),
    );

    return blogs;
  } catch (error) {
    console.error("Error in getAllBlogs:", error);
    return [];
  }
}
