import { AppShell } from "@/features/layout-shell/components/app-shell";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
