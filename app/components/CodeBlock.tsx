"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm group">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          title="Copy code"
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
