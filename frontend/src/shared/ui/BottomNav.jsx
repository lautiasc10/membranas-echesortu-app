import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Package, ShoppingCart, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { to: "/admin", label: "Inicio", icon: LayoutDashboard, end: true },
    { to: "/admin/clients", label: "Clientes", icon: Users },
    { to: "/admin/inventory", label: "Inventario", icon: Package },
    { to: "/admin/sales", label: "Ventas", icon: ShoppingCart },
    { to: "/admin/quotes", label: "Presup.", icon: FileText },
];

export function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-16 bg-sidebar border-t border-sidebar-border/60 flex items-center justify-around px-2 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)] backdrop-blur-md">
            {items.map((it) => (
                <NavLink
                    key={it.to}
                    to={it.to}
                    end={it.end}
                    className={({ isActive }) =>
                        cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200",
                            isActive
                                ? "text-sidebar-primary"
                                : "text-sidebar-foreground/40 hover:text-sidebar-foreground/60"
                        )
                    }
                >
                    <it.icon className={cn("size-5", "opacity-90")} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{it.label}</span>

                    {/* Active indicator dot */}
                    <div className={cn(
                        "h-1 w-1 rounded-full mt-0.5 transition-all duration-300",
                        "bg-sidebar-primary opacity-0 scale-0",
                        "active-indicator" // Placeholder class for the logic below
                    )} />
                </NavLink>
            ))}
        </nav>
    );
}
