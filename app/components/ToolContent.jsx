import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Shadcn components
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Preprocess content to fix HTML-wrapped tables
const preprocessContent = (content) => {
  if (!content) return content;

  // Extract tables from <p> tags and convert back to markdown
  return content.replace(
    /<p>(\s*\|[\s\S]*?\|[\s\S]*?\|\s*)<\/p>/g,
    (match, tableContent) => {
      // Return the table content without <p> tags, preceded by a newline for proper parsing
      return "\n" + tableContent + "\n";
    },
  );
};

const ToolContent = ({ content, className = "" }) => {
  if (!content) {
    return <div className="text-red-500 text-center">No content available</div>;
  }

  // Process the content to fix HTML-wrapped tables
  const processedContent = preprocessContent(content);

  return (
    <Card className={`p-4 md:p-6 max-w-full mx-auto ${className}`}>
      {/* Markdown Content */}
      <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none break-words overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                className="text-xl font-bold mt-5 mb-3 break-words"
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                className="text-lg font-bold mt-4 mb-2 break-words"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="my-3 leading-relaxed break-words" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-6 my-3" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-6 my-3" />
            ),
            li: ({ node, ...props }) => <li {...props} className="my-1" />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-3 italic"
              />
            ),
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-blue-600 dark:text-blue-400 hover:underline break-words"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
            img: ({ src, alt, ...props }) => {
              if (!src) return null;
              return (
                <img
                  src={src}
                  alt={alt || "content image"}
                  className="max-w-full h-auto rounded-md my-4 object-contain"
                  {...props}
                />
              );
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4 w-full border rounded-lg border-gray-300 dark:border-gray-700">
                <table {...props} className="min-w-full border-collapse" />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead {...props} className="bg-gray-100 dark:bg-gray-800" />
            ),
            tbody: ({ node, ...props }) => (
              <tbody
                {...props}
                className="bg-white dark:bg-gray-900 divide-y divide-gray-300 dark:divide-gray-700"
              />
            ),
            tr: ({ node, ...props }) => (
              <tr
                {...props}
                className="border-b border-gray-300 dark:border-gray-700"
              />
            ),
            th: ({ node, ...props }) => (
              <th
                {...props}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r last:border-r-0 border-gray-300 dark:border-gray-700"
              />
            ),
            td: ({ node, ...props }) => (
              <td
                {...props}
                className="px-4 py-3 text-sm break-words border-r last:border-r-0 border-gray-300 dark:border-gray-700"
              />
            ),
            hr: ({ node, ...props }) => <Separator className="my-6" />,
            pre: ({ node, ...props }) => (
              <pre
                {...props}
                className="overflow-x-auto max-w-full p-4 bg-gray-800 dark:bg-gray-900 rounded-md my-4 text-white"
              />
            ),
            code: ({ node, inline, className, children, ...props }) => {
              return inline ? (
                <code
                  {...props}
                  className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded-md text-sm"
                >
                  {children}
                </code>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <code className="block whitespace-pre text-sm p-4 bg-gray-800 dark:bg-gray-900 rounded-md text-white my-4">
                    {String(children).replace(/\n$/, "")}
                  </code>
                </div>
              );
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </article>
    </Card>
  );
};

export default ToolContent;
