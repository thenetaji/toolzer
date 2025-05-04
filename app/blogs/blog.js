import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, "content");
const blogIndex = [];

const getAllBlog = () => {
  console.log("Scanning content directory...");

  const walkDir = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat && stat.isDirectory()) {
        results = results.concat(walkDir(fullPath));
      } else if (file.endsWith(".md")) {
        results.push(fullPath);
      }
    });

    return results;
  };

  const files = walkDir(contentDir);
  console.log(`Found ${files.length} Markdown files.`);

  return files
    .map((filePath) => {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");

        if (typeof raw !== "string") {
          console.warn(`Skipping ${filePath}: Not a string`);
          return null;
        }

        const { data, content } = matter(raw);
        const htmlContent = marked(content);

        return { data, content: htmlContent };
      } catch (err) {
        console.error(`Error reading ${filePath}:`, err.message);
        return null;
      }
    })
    .filter(Boolean);
};

function generateStaticBlog() {
  const blogData = getAllBlog();

  blogData.forEach(({ data, content }) => {
    try {
      console.log(`Generating page for: ${data.title} (${data.slug})`);

      const page = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${data.title}</title>
  <meta name="description" content="${data.description}" />
  <meta name="author" content="${data.author}" />
  <meta name="keywords" content="${data.keywords}" />

  <!-- Open Graph tags -->
  <meta property="og:title" content="${data.title}" />
  <meta property="og:description" content="${data.description}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${data.featured_image}" />
  <meta property="og:url" content="${data.url}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${data.title}" />
  <meta name="twitter:description" content="${data.description}" />
  <meta name="twitter:image" content="${data.featured_image}" />

  <style>
    .blog-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    .blog-content h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-top: 1.75rem;
      margin-bottom: 1rem;
      line-height: 1.3;
    }
    .blog-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .blog-content h4 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.75rem;
    }
    .blog-content h5 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    .blog-content h6 {
      font-size: 1rem;
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    .blog-content p {
      margin-bottom: 1.5rem;
      line-height: 1.7;
    }
    .blog-content a {
      color: #3b82f6;
      text-decoration: underline;
    }
    .blog-content a:hover {
      color: #2563eb;
    }
    .blog-content ul,
    .blog-content ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    .blog-content ul {
      list-style-type: disc;
    }
    .blog-content ol {
      list-style-type: decimal;
    }
    .blog-content blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 1rem;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 1.5rem;
      font-style: italic;
    }
    .blog-content code {
      background-color: #f3f4f6;
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
      font-size: 0.9em;
    }
    .blog-content pre {
      background-color: #1f2937;
      color: #e5e7eb;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin-bottom: 1.5rem;
    }
    .blog-content pre code {
      background-color: transparent;
      padding: 0;
      color: inherit;
    }
    .blog-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1.5rem auto;
    }

    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .blog-content a {
        color: #60a5fa;
      }
      .blog-content a:hover {
        color: #93c5fd;
      }
      .blog-content blockquote {
        border-left-color: #4b5563;
      }
      .blog-content code {
        background-color: #374151;
        color: #e5e7eb;
      }
    }
  </style>
</head>
<body>
  <div class="max-w-3xl mx-auto px-4 py-10 text-gray-900 dark:text-gray-100">
    <!-- Blog Header Section -->
    <header class="mb-10">
      <h1 class="text-4xl sm:text-5xl font-bold mb-3 leading-tight">
        ${data.title}
      </h1>
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        <time datetime="${data.date}">${data.date}</time>
        ${data.author ? `<span class="mx-2">•</span><span>${data.author}</span>` : ""}
        ${data.category ? `<span class="mx-2">•</span><span class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-xs">${data.category}</span>` : ""}
      </div>
      ${data.featured_image ? `<div class="mb-8 rounded-lg overflow-hidden"><img src="${data.featured_image}" alt="${data.title}" class="w-full h-auto object-cover" /></div>` : ""}
    </header>

    <!-- Blog Content Section -->
    <article class="blog-content">
      ${content ? `<div>${content}</div>` : ""}
    </article>
  </div>
</body>
</html>`;

      const filePath = path.join(
        __dirname,
        "../public",
        "blog",
        `${data.slug}.html`,
      );

      fs.writeFileSync(filePath, page, "utf8");
      blogIndex.push(data);

      console.log(`Wrote file to ${filePath}`);
    } catch (err) {
      console.error(`Failed to write page for ${data.slug}:`, err.message);
    }
  });
}

generateStaticBlog();

fs.writeFileSync(
  path.join(__dirname, "../src", "data", "blog.json"),
  JSON.stringify(""),
  "utf-8",
);
fs.writeFileSync(
  path.join(__dirname, "../src", "data", "blog.json"),
  JSON.stringify(blogIndex),
  "utf-8",
);
