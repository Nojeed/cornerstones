import { getDocsData } from "./lib/parse";
import { redirect } from "next/navigation";

export default function Home() {
  const sections = getDocsData();
  if (sections.length > 0) {
    redirect(`/${sections[0].slug}`);
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Cornerstones</h1>
        <p className="text-gray-500">No content found.</p>
      </div>
    </div>
  );
}
