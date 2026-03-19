import { useState, useEffect } from "react";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { Sidebar } from "../shared/ui/Sidebar";
import { Topbar } from "../shared/ui/Topbar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <ScrollRestoration />
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Mobile Sidebar Overlay */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="p-0 w-64 border-none" aria-describedby={undefined}>
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <Sidebar className="w-full h-full" />
          </SheetContent>
        </Sheet>

        <main className="flex-1 min-w-0">
          <Topbar onMenuClick={() => setIsMobileOpen(true)} />
          <div className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
          <footer className="border-t border-border/40 py-8 px-10">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              <p>© {new Date().getFullYear()} Membranas Echesortu. Intelligence System.</p>
              <div className="flex gap-6 uppercase">
                <span className="hover:text-foreground cursor-default transition-colors">v1.0.0</span>
                <span className="hover:text-foreground cursor-default transition-colors">Soporte</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
