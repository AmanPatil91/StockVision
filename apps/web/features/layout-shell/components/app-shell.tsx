import { ReactNode } from "react";

import { AppSidebar } from "@/features/layout-shell/components/app-sidebar";
import { TopNav } from "@/features/layout-shell/components/top-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-radial-shell">
      <div className="fixed inset-0 grid-shell opacity-60" />
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopNav />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

