import React from "react";

export default function ToolContainer({ tool, content, title }) {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-4 text-center py-2">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      )}

      {/* Tool Section*/}
      <div className="mb-8 w-full">{tool}</div>

      {/* Content Section */}
      <div>{content}</div>
    </div>
  );
}
