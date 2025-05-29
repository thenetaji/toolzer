import React from "react";

function ToolContainer({ title, description, tool, content }) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Title and Description Section */}
      <section className="about-tool mb-8 text-center p-2 mt-2">
        <h1 className="text-2xl md:text-4xl font-bold bg-clip-text mb-2">
          {title}
        </h1>
        <h2 className="text-md text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
          {description}
        </h2>
      </section>

      {/* Tool Section*/}
      <section className="tool mb-8 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {tool}
      </section>

      {/* Content Section */}
      <section className="tool-content mt-6">{content}</section>
    </div>
  );
}

export default ToolContainer;
