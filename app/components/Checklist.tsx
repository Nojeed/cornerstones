"use client";

import { useProgress } from "../lib/store";
import { ChecklistItem } from "../lib/parse";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

interface ChecklistProps {
  items: ChecklistItem[];
  prefix: string; // unique prefix for this block (e.g. section-subsection-index)
}

export function Checklist({ items, prefix }: ChecklistProps) {
  // we need to ensure hydration doesn't mismatch
  const [mounted, setMounted] = useState(false);
  const { isCompleted, toggleItem } = useProgress();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render unchecked state on server/initial load to avoid mismatch
    return (
      <ul className="space-y-3 my-4">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
          >
            <div className="mt-1 h-5 w-5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center shrink-0"></div>
            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-3 my-4">
      {items.map((item, idx) => {
        const id = `${prefix}-${idx}`;
        const checked = isCompleted(id);

        return (
          <li
            key={idx}
            className={clsx(
              "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer group",
              checked
                ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700"
            )}
            onClick={() => toggleItem(id)}
          >
            <div
              className={clsx(
                "mt-1 h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                checked
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-blue-400"
              )}
            >
              {checked && <Check size={14} strokeWidth={3} />}
            </div>
            <span
              className={clsx(
                "leading-relaxed transition-colors select-none",
                checked
                  ? "text-gray-500 line-through decoration-gray-400"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              {item.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
