import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, FileText, LogOut, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/img/logo-membrana.png";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const items = [
  { to: "/admin", label: "Panel de control", icon: LayoutDashboard, end: true },
  { to: "/admin/clients", label: "Clientes", icon: Users },
  { to: "/admin/inventory", label: "Inventario de Productos", icon: Package },
  { to: "/admin/sales", label: "Ventas", icon: ShoppingCart },
  { to: "/admin/quotes", label: "Presupuestos", icon: FileText },
  { to: "/admin/settings", label: "Configuración", icon: Settings },
];

export function Sidebar({ className }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/login");
  };

  return (
    <aside className={cn("flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground sticky top-0 h-screen w-64", className)}>
      <div className="p-8 flex items-center gap-3">
        <div className="size-10 flex items-center justify-center">
          <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">Membranas</p>
          <p className="text-[10px] text-accent uppercase font-black tracking-widest mt-0.5">Echesortu</p>
        </div>
      </div>

      <nav className="px-4 space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-sidebar-primary/20"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )
            }
          >
            <it.icon className={cn("size-3.5", "opacity-80")} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 space-y-2">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
        >
          <Globe className="size-3.5 opacity-80" />
          Volver al Sitio
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="size-3.5 opacity-80" />
          Cerrar Sesión
        </button>

        <div className="rounded-lg border border-sidebar-border/50 bg-sidebar-accent/30 p-4 mt-4">
          <p className="text-[9px] font-bold text-accent uppercase tracking-[0.2em]">
            System Online
          </p>
          <div className="h-1 w-8 bg-accent rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </aside>
  );
}