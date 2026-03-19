import { Outlet, ScrollRestoration } from "react-router-dom";
import { CartDrawer } from "../../shared/ui/CartDrawer";
import { CartWidget } from "../../shared/ui/CartWidget";

export function PublicLayout() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <ScrollRestoration />
            <main>
                <Outlet />
            </main>
            <CartWidget />
            <CartDrawer />
        </div>
    );
}
