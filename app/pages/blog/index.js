import Head from "@/components/Head";
import { getAllBlogs } from "@/lib/api";

export default function BlogPage({ blogs }) {
  return (
    <>
      <Head
        title={"Blog | Toolzer"}
        description={
          "Explore our blog to learn about our tools, technology, and innovations. Stay updated with our latest insights and articles."
        }
        pageUrl={"/blog"}
      />

      <div className="px-4 py-8 max-w-4xl mx-auto font-sans text-gray-900 dark:text-gray-100">
        <header className="text-center mb-12 border-b border-gray-300 dark:border-gray-700 pb-6">
          <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn about our tools and technology
          </p>
        </header>

        <div>
          {!blogs || blogs.length === 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-2">No blogs found</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Could not find any blog posts.
              </p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.slug}
                onClick={() => (window.location.href = `/blog/${blog.slug}`)}
                className="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow hover:shadow-md transition-transform hover:scale-[1.01] bg-white dark:bg-gray-800"
              >
                <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {blog.data.title}
                </h2>

                {blog.data.date && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {new Date(blog.data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                {blog.data.excerpt && (
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {blog.data.excerpt}
                  </p>
                )}

                {blog.data.tags && blog.data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={`/blog/${blog.data.slug}`}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Read more &rarr;
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const blogs = await getAllBlogs();

    return {
      props: {
        blogs,
      },
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        blogs: [],
      },
    };
  }
}
