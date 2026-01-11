import fs from "fs";
import path from "path";

export interface LinkItem {
  text: string;
  url: string;
  description: string;
}

export interface ChecklistItem {
  id: string; // generated from text
  text: string;
}

export interface CodeBlock {
  language: string;
  code: string;
}

export type ContentBlock =
  | { type: "text"; content: string }
  | { type: "checklist"; items: ChecklistItem[] }
  | { type: "links"; items: LinkItem[] }
  | { type: "code"; data: CodeBlock }
  | { type: "hr" };

export interface SubSection {
  title: string;
  slug: string;
  blocks: ContentBlock[];
}

export interface Section {
  title: string;
  slug: string; // for URL
  intro: ContentBlock[]; // For "Recommended Learning" usually found before first h3
  subsections: SubSection[];
}

export function getDocsData(): Section[] {
  const filePath = path.join(process.cwd(), "cornerstones.md");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // Split by H2
  const h2Splits = fileContent.split(/^## /m);

  const sections: Section[] = [];

  for (let i = 1; i < h2Splits.length; i++) {
    const chunk = h2Splits[i];
    const lines = chunk.split("\n");
    const title = lines[0].trim();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Content after title
    const content = lines.slice(1).join("\n");

    // Split by H3
    const h3Splits = content.split(/^### /m);

    // The first part is the intro under H2 (Recommended Learning)
    const introRaw = h3Splits[0];
    const introBlocks = parseContent(introRaw);

    const subsections: SubSection[] = [];

    for (let j = 1; j < h3Splits.length; j++) {
      const subChunk = h3Splits[j];
      const subLines = subChunk.split("\n");
      const subTitle = subLines[0].trim();
      const subSlug = subTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const subContentRaw = subLines.slice(1).join("\n");
      const blocks = parseContent(subContentRaw);

      subsections.push({
        title: subTitle,
        slug: subSlug,
        blocks,
      });
    }

    sections.push({
      title,
      slug,
      intro: introBlocks,
      subsections,
    });
  }

  return sections;
}

function parseContent(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Check for code blocks first as they are multiline
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  if (text.includes("```")) {
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Text before code
      const prevText = text.slice(lastIndex, match.index);
      if (prevText.trim()) {
        blocks.push(...parseListsOrText(prevText));
      }

      blocks.push({
        type: "code",
        data: {
          language: match[1] || "text",
          code: match[2].trim(),
        },
      });

      lastIndex = match.index + match[0].length;
    }

    const remaining = text.slice(lastIndex);
    if (remaining.trim()) {
      blocks.push(...parseListsOrText(remaining));
    }
  } else {
    blocks.push(...parseListsOrText(text));
  }

  return blocks;
}

function parseListsOrText(text: string): ContentBlock[] {
  const lines = text.split("\n");
  const blocks: ContentBlock[] = [];

  let listBuffer: string[] = [];
  let textBuffer: string[] = [];

  const flushText = () => {
    if (textBuffer.length > 0) {
      const content = textBuffer.join("\n").trim();
      if (content) {
        // Check for HR
        if (content === "---" || content === "***") {
          blocks.push({ type: "hr" });
        } else {
          blocks.push({ type: "text", content });
        }
      }
      textBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      // Determine if Links or Checklist
      // Heuristic: Check if lines look like links: - [Text](url) - Desc
      // We allow some flexibility, but majority should look like links to count as links.
      const linkMatchRegex = /^-\s*\[.*\]\(.*\)/;
      const linkCount = listBuffer.filter((l) =>
        l.match(linkMatchRegex)
      ).length;
      const isLinkList = linkCount > 0 && linkCount >= listBuffer.length * 0.7; // 70% match threshold

      if (isLinkList) {
        const items: LinkItem[] = listBuffer.map((line) => {
          const linkMatch = line.match(/^-\s*\[(.*?)\]\((.*?)\)\s*-?\s*(.*)$/);
          if (linkMatch) {
            return {
              text: linkMatch[1],
              url: linkMatch[2],
              description: linkMatch[3],
            };
          }
          // Fallback for non-matching lines in a link block
          const clean = line.replace(/^-\s*/, "");
          return { text: clean, url: "#", description: "" };
        });
        blocks.push({ type: "links", items });
      } else {
        const items: ChecklistItem[] = listBuffer.map((line) => {
          const cleanText = line.replace(/^-\s*/, "").replace(/^\[ \]\s*/, "");
          const id = cleanText.substring(0, 32).replace(/[^a-zA-Z0-9]/g, "");
          return {
            id,
            text: cleanText,
          };
        });
        blocks.push({ type: "checklist", items });
      }
      listBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Identify list item: starts with dash followed by space
    // Note: '---' does NOT match /^-\s/
    if (trimmed.match(/^-\s+/)) {
      // If we were building text, flush it
      flushText();
      listBuffer.push(trimmed);
    } else {
      // If we were building list, flush it
      flushList();

      // Check if it's a separator line '---'
      if (trimmed === "---" || trimmed === "***") {
        // It's a separator. Flush text before it?
        // Since we are in the "else" (non-list), we just handle mixed text.
        // We can push it to textBuffer, and flushText handles detection of pure HR.
        // But if textBuffer has other text, we might want to split.
        // For simplicity, let's just add to text buffer.
        // If the PREVIOUS line was text, it joins.
        // Ideally we want HR to be its own block.

        flushText(); // Flush any accumulated text
        blocks.push({ type: "hr" });
      } else {
        textBuffer.push(trimmed);
      }
    }
  }

  // Flush remaining
  flushText();
  flushList();

  return blocks;
}
