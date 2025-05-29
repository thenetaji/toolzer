import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Shadcn components
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ToolContent = ({ content, className = "" }) => {
  if (!content) {
    return <div className="text-red-500">No content available</div>;
  }

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
            img: ({ node, ...props }) => (
              <img
                {...props}
                className="max-w-full h-auto rounded-md my-4 object-contain"
                alt={props.alt || "content image"}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4 w-full">
                <table
                  {...props}
                  className="table-auto w-full border-collapse divide-y divide-gray-300 dark:divide-gray-700"
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead {...props} className="bg-gray-100 dark:bg-gray-800" />
            ),
            th: ({ node, ...props }) => (
              <th
                {...props}
                className="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              />
            ),
            td: ({ node, ...props }) => (
              <td {...props} className="px-3 py-2 text-sm break-words" />
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
          {content}
        </ReactMarkdown>
      </article>
    </Card>
  );
};

export default ToolContent;
