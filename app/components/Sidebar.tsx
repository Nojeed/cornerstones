"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Section } from "../lib/parse";
import { ThemeToggle } from "./ThemeToggle";
import clsx from "clsx";
import Image from "next/image";

interface SidebarProps {
  sections: Section[];
}

export function Sidebar({ sections }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-gray-50 dark:bg-[#1a202c] border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-colors">
      <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a202c] shrink-0 gap-3">
        {/* Logo */}
        <div className="w-40 h-40 relative mx-auto mt-4 shrink-0">
          <Image
            src="/logo.svg"
            alt="Cornerstones"
            fill
            className="object-contain"
          />
        </div>
      
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {sections.map((section) => {
          const isActive = pathname === `/${section.slug}`;
          return (
            <Link
              key={section.slug}
              href={`/${section.slug}`}
              className={clsx(
                "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white dark:bg-gray-800 text-[#d0a04f] shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              {section.title.replace(/^[0-9]+\.\s*/, "")}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a202c] shrink-0 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">Appearance</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
