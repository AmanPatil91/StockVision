import { Settings } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace controls and platform preferences"
        description="This area will expand into chart presets, watchlist sync, indicator defaults, alert configuration, and user-level customization."
      />
      <EmptyState
        icon={Settings}
        title="Settings foundation ready"
        description="Theme switching is already enabled. Deeper personalization and account settings can plug into this route later."
      />
    </div>
  );
}

