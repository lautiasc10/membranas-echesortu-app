import { Outlet } from "react-router-dom";
import { CartDrawer } from "../../shared/ui/CartDrawer";
import { CartWidget } from "../../shared/ui/CartWidget";

export function PublicLayout() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <main>
                <Outlet />
            </main>
            <CartWidget />
            <CartDrawer />
        </div>
    );
}
