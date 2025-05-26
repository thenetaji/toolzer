import React from "react";

function ToolContainer({ title, description, tool, content }) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Title and Description Section */}
      <div className="mb-8 text-center p-2 mt-2">
        <h1 className="text-2xl md:text-4xl font-bold bg-clip-text mb-2">
          {title}
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
          {description}
        </p>
      </div>

      {/* Tool Section*/}
      <div className="mb-8 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {tool}
      </div>

      {/* Content Section */}
      <div className="mt-6">{content}</div>
    </div>
  );
}

export default ToolContainer;
