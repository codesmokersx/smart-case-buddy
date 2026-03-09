import { AppLayout } from "@/components/AppLayout";
import { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  icon: LucideIcon;
  description: string;
}

export function PlaceholderPage({ title, icon: Icon, description }: PlaceholderPageProps) {
  return (
    <AppLayout title={title}>
      <div className="flex flex-1 items-center justify-center p-12">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        </div>
      </div>
    </AppLayout>
  );
}
