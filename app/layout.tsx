import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { getDocsData } from "./lib/parse";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cornerstones",
  description: "Full-Stack Developer Reference Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sections = getDocsData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors cursor-default`}
      >
        <div className="flex min-h-screen">
          <Sidebar sections={sections} />
          <main className="flex-1 ml-72 min-h-screen bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto px-8 py-12">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
