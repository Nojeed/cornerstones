"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Section } from "../lib/parse";
import { ThemeToggle } from "./ThemeToggle";
import clsx from "clsx";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  sections: Section[];
}

export function Sidebar({ sections }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-[#395566] dark:text-[#7a8f97]">
            Cornerstones
          </span>
        </div>
        {/* Optional: Add Logo or something else on the right if needed, or just keep it simple */}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 w-72 bg-gray-50 dark:bg-[#1a202c] border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a202c] shrink-0">
          {/* Logo */}
          <div className="w-32 h-32 relative shrink-0">
            <Image
              src="/logo.svg"
              alt="Cornerstones"
              fill
              className="object-contain"
            />
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
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
    </>
  );
}
