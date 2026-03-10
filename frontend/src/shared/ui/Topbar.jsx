import { Bell, Menu, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/login");
  };

  // Extraer nombre o usar default
  const name = user?.name ? user.name.split(" ")[0] : "Admin";
  // Extraer iniciales (hasta 2 letras max)
  const initials = user?.name
    ? user.name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase().substring(0, 2)
    : "AU";
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="h-16 px-6 lg:px-10 flex items-center justify-between max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="size-5" />
          </Button>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Operaciones Logísticas
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="relative group">
            <Bell className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-accent ring-2 ring-background ring-offset-0" />
          </Button>

          <div className="h-4 w-px bg-border/40" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 group cursor-pointer hover:bg-accent/5 p-1.5 rounded-lg transition-colors">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold leading-none text-foreground tracking-tight">{name}</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {user?.role === "superadmin" ? "S. Admin" : "Admin"}
                  </p>
                </div>
                <div className="size-8 rounded-md bg-sidebar-accent border border-sidebar-border shadow-sm flex items-center justify-center text-[11px] font-bold text-primary tracking-wider">
                  {initials}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer">
                <Globe className="mr-2 h-4 w-4" />
                <span>Volver al Sitio</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-500 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}