
import { notFound } from "next/navigation";
import Link from "next/link";
import { mockSections } from "@/lib/data";
import { TabManager } from "@/components/settings/TabManager";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SectionTabsPage({ params }: { params: { id: string } }) {
  // In a real app, this data would be fetched from a database
  const section = mockSections.find((s) => s.id === params.id);

  if (!section) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/settings?tab=sections">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to sections</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Manage Tabs for: {section.name}</h1>
          <p className="text-muted-foreground">
            Add, edit, and reorder tabs that appear within this section.
          </p>
        </div>
      </div>
      <TabManager section={section} />
    </div>
  );
}
