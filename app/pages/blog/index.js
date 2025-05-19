import Head from "next/head";
import { getAllSimpleBlogs } from "@/lib/api";

export default function SimpleBlogPage({ blogs }) {
  return (
    <>
      <Head>
        <title>Our Blog | Learn About Our Tools and Technology</title>
        <meta
          name="description"
          content="Explore our blog to learn about our tools, technology, and innovations. Stay updated with our latest insights and articles."
        />
        <meta name="keywords" content="blog, tools, technology, updates, articles, insights" />
        <meta name="author" content="Your Team Name" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Our Blog | Learn About Our Tools and Technology" />
        <meta
          property="og:description"
          content="Explore our blog to learn about our tools, technology, and innovations. Stay updated with our latest insights and articles."
        />
        <meta property="og:image" content="https://example.com/images/blog-social.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Blog | Learn About Our Tools and Technology" />
        <meta
          name="twitter:description"
          content="Explore our blog to learn about our tools, technology, and innovations."
        />
        <meta name="twitter:image" content="https://example.com/images/blog-social.jpg" />
      </Head>

      <div
        style={{
          padding: "2rem",
          maxWidth: "1000px",
          margin: "0 auto",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#333",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "3rem",
            borderBottom: "1px solid #eaeaea",
            paddingBottom: "1.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              color: "#222",
            }}
          >
            Our Blog
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Learn about our tools and technology
          </p>
        </header>

        <div>
          {!blogs || !blogs.length ? (
            <div>
              <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                No blogs found
              </h1>
              <p>Could not find any blog posts.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.slug}
                style={{
                  border: "1px solid #eaeaea",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => (window.location.href = `/blog/${blog.slug}`)}
              >
                <h2
                  style={{
                    fontSize: "1.6rem",
                    marginBottom: "0.75rem",
                    color: "#222",
                    fontWeight: "600",
                  }}
                >
                  {blog.title}
                </h2>

                {blog.date && (
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "0.75rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                {blog.excerpt && (
                  <p
                    style={{
                      marginBottom: "1.2rem",
                      color: "#444",
                      lineHeight: "1.6",
                    }}
                  >
                    {blog.excerpt}
                  </p>
                )}

                {blog.tags && blog.tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: "#f0f0f0",
                          color: "#555",
                          padding: "0.15rem 0.6rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={`/blog/${blog.slug}`}
                  style={{
                    color: "#0066cc",
                    textDecoration: "none",
                    display: "inline-block",
                    fontWeight: "500",
                  }}
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

export function getStaticProps() {
  try {
    const blogs = getAllSimpleBlogs();
    console.log(`Simplest blog index: Found ${blogs.length} blogs`);

    return {
      props: {
        blogs: JSON.parse(JSON.stringify(blogs)), // Force serialization
      },
    };
  } catch (error) {
    console.error("Error in simplest blog getStaticProps:", error);
    return { props: { blogs: [] } };
  }
}