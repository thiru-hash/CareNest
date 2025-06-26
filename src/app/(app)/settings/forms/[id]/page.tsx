
import { notFound } from "next/navigation";
import Link from "next/link";
import { mockForms } from "@/lib/data";
import { FormFieldManager } from "@/components/settings/FormFieldManager";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function FormEditorPage({ params }: { params: { id: string } }) {
  // In a real app, this data would be fetched from a database
  const form = mockForms.find((f) => f.id === params.id);

  if (!form) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/settings?tab=forms">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to forms</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold">Edit Form: {form.name}</h1>
            <p className="text-muted-foreground">
                Add, edit, and reorder fields for this form.
            </p>
        </div>
      </div>
      <FormFieldManager form={form} />
    </div>
  );
}
