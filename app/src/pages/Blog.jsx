import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Clock,
  User,
  Sparkles,
  Filter,
} from "lucide-react";

import { getAllBlogs } from "../lib/getBlog";
import { marked } from "marked";

export function SingleBlogPost() {
  const { slug } = useParams();
  const blog = getAllBlogs().find((b) => b.slug === slug);

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-900 dark:text-white">
        Blog not found.
      </div>
    );

  const { data, content } = blog;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-900 dark:text-gray-100">
      {/* Blog Header Section */}
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight">
          {data.title}
        </h1>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <time dateTime={data.date}>{data.date}</time>
          {data.author && (
            <>
              <span className="mx-2">•</span>
              <span>{data.author}</span>
            </>
          )}
          {data.category && (
            <>
              <span className="mx-2">•</span>
              <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-xs">
                {data.category}
              </span>
            </>
          )}
        </div>
        {data.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={data.featured_image}
              alt={data.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </header>

      {/* Custom styles for Markdown content */}
      <style jsx global>{`
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
      `}</style>

      {/* Blog Content Section */}
      <article
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      />
    </div>
  );
}

function BlogListingPage({ blogData }) {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const postsPerPage = 9;
  const { posts, categories, featuredPosts } = blogData;

  // Extract all unique categories from posts for the filter dropdown
  const allCategories = React.useMemo(() => {
    const uniqueCategories = new Set();
    posts.forEach((post) => {
      post.categories.forEach((category) => {
        uniqueCategories.add(category.name);
      });
    });
    return Array.from(uniqueCategories).sort();
  }, [posts]);

  // Filter and sort posts based on search query, category, and sort option
  useEffect(() => {
    let filtered = [...posts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query),
      );
    }

    // Filter by category if not "all"
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) =>
        post.categories.some((category) => category.name === selectedCategory),
      );
    }

    // Sort posts
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt),
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      default:
        filtered.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
        );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, sortBy, posts]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Blog Header Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Toolzer Blog</h1>
        <p className="text-xl text-muted-foreground">
          Insights, tutorials, and updates about our tools and digital
          productivity
        </p>
      </div>

      {/* Featured Posts Carousel - Only show if we have featured posts */}
      {featuredPosts && featuredPosts.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <Sparkles className="text-amber-500 w-5 h-5 mr-2" />
            <h2 className="text-2xl font-bold">Featured Posts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <Card className="overflow-hidden h-full border-border/60 hover:border-primary/30 transition-colors">
                    {/* Featured post image */}
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <CardContent className="p-5">
                      {/* Category badge */}
                      {post.categories[0] && (
                        <Badge variant="secondary" className="mb-2">
                          {post.categories[0].name}
                        </Badge>
                      )}

                      {/* Post title */}
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {/* Post excerpt */}
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Post meta */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>

                        <span className="text-primary font-medium flex items-center">
                          Read more
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filtering and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-end justify-between w-full">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center justify-center pl-4 w-full overflow-x-scroll">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm mr-2">Filter:</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1 items-center">
                {selectedCategory === "all"
                  ? "All Categories"
                  : selectedCategory}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                All Categories
              </DropdownMenuItem>
              <div className="max-h-[300px] overflow-y-auto">
                {allCategories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog Listing */}
      <div className="mb-12">
        {selectedCategory !== "all" && (
          <div className="mb-6 flex items-center">
            <h2 className="text-2xl font-semibold">{selectedCategory}</h2>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => setSelectedCategory("all")}
            >
              Clear Filter
            </Button>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">
              No matching posts found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSortBy("newest");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + sortBy + currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <Card className="overflow-hidden h-full border-border/60 hover:border-primary/30 transition-colors">
                      {/* Post image */}
                      {post.coverImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <CardContent className="p-5">
                        {/* Category badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.categories.slice(0, 2).map((category, idx) => (
                            <Badge key={idx} variant="secondary">
                              {category.name}
                            </Badge>
                          ))}
                          {post.categories.length > 2 && (
                            <Badge variant="outline">
                              +{post.categories.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Post title */}
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        {/* Post excerpt */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Post meta */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="text-xs">
                                {formatDate(post.publishedAt).split(",")[0]}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="text-xs">
                                {post.readingTime}
                              </span>
                            </div>
                          </div>

                          {post.author && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="h-3.5 w-3.5" />
                              <span className="text-xs">
                                {post.author.name.split(" ")[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((curr) => Math.max(curr - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((curr) => Math.min(curr + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-16 border-t pt-4">
        <p>Last Updated: 2025-04-26 14:33:41 (UTC)</p>
        <p>Maintained by thenetajiblog</p>
      </div>
    </div>
  );
}

function BlogIndex() {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an API call to fetch blog data
    // In a real app, you would fetch from your API endpoint
    const fetchBlogData = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/blog');
        // const data = await response.json();

        // Using sample data for demonstration
        const data = sampleBlogData;

        setBlogData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-12 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card/40 border border-border/60 rounded-lg overflow-hidden"
              >
                <div className="h-48 bg-muted animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 bg-muted rounded w-1/4 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted rounded w-1/4 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <BlogListingPage blogData={blogData} />;
}
