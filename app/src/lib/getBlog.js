import matter from "front-matter";

export const getAllBlogs = () => {
  const files = import.meta.glob("/src/blogs/**/*.md", {
    eager: true,
    as: "raw",
  });

  return Object.entries(files)
    .map(([path, raw]) => {
      if (typeof raw !== "string") {
        console.warn(`Skipping ${path}: Not a string`);
        return null;
      }

      const { attributes: data, body: content } = matter(raw);

      const slug = path.split("/").pop().replace(".md", "");
      
      console.log(`Data being returned from getAllBlogs function: ${JSON.stringify(slug)}, ${JSON.stringify(data, null, 2)}}`);
      return { slug, data, content };
    })
    .filter(Boolean);
};
