import {
    SidebarInset,
    SidebarProvider,
  } from "@/components/ui/sidebar"
  import { AppSidebar } from "@/components/app-sidebar"

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="h-full w-full">
                <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
       {children}
      </SidebarInset>
    </SidebarProvider>

        </div>
    );
  }
  