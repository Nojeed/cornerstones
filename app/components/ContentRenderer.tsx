"use client";

import { ContentBlock } from "../lib/parse";
import { Checklist } from "./Checklist";
import { CodeBlock } from "./CodeBlock";
import { ExternalLink } from "lucide-react";

interface ContentRendererProps {
  blocks: ContentBlock[];
  idPrefix: string;
}

export function ContentRenderer({ blocks, idPrefix }: ContentRendererProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "text") {
          return (
            <p
              key={index}
              className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl whitespace-pre-wrap"
            >
              {block.content}
            </p>
          );
        }

        if (block.type === "hr") {
          return (
            <hr
              key={index}
              className="my-8 border-gray-200 dark:border-gray-800"
            />
          );
        }

        if (block.type === "checklist") {
          return (
            <Checklist
              key={index}
              items={block.items}
              prefix={`${idPrefix}-list-${index}`}
            />
          );
        }

        if (block.type === "links") {
          return (
            <div key={index} className="grid sm:grid-cols-2 gap-4 my-6">
              {block.items.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#d0a04f] dark:hover:border-[#d0a04f] hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#d0a04f]">
                    <ExternalLink size={16} />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white group-hover:text-[#d0a04f] transition-colors mb-2 pr-6">
                    {link.text}
                  </span>
                  {link.description && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {link.description.replace(/^- /, "")}
                    </span>
                  )}
                </a>
              ))}
            </div>
          );
        }

        if (block.type === "code") {
          return (
            <CodeBlock
              key={index}
              code={block.data.code}
              language={block.data.language}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
