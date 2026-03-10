import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout/PublicLayout";
import { ErrorPage } from "../shared/ui/ErrorPage";

import { DashboardPage } from "../modules/dashboard/page/DashboardPage";
import { ClientsPage } from "../modules/clients/page/ClientsPage";
import InventoryPage from "../modules/inventory/page/InventoryPage";
import SalesPage from "../modules/sales/page/SalesPage";
import { SettingsPage } from "../modules/settings/page/SettingsPage";
import { LandingPage } from "../modules/landing/page/LandingPage";
import { CatalogPage } from "../modules/catalog/page/CatalogPage";
import { GalleryPage } from "../modules/gallery/page/GalleryPage";
import { QuotePrintPage } from "../modules/quotes/page/QuotePrintPage";
import { LoginPage } from "../modules/auth/page/LoginPage";
import { RegisterPage } from "../modules/auth/page/RegisterPage";
import { OffersPage } from "../modules/offers/page/OffersPage";
import { QuotesPage } from "../modules/quotes/page/QuotesPage";
import { RequireAuth } from "../shared/context/RequireAuth";
import { RequireAdmin } from "../shared/context/RequireAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "catalogo", element: <CatalogPage /> },
      { path: "galeria", element: <GalleryPage /> },
      { path: "ofertas", element: <RequireAuth><OffersPage /></RequireAuth> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/registro",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/quotes/:id/print",
    element: <RequireAdmin><QuotePrintPage /></RequireAdmin>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <RequireAdmin><AdminLayout /></RequireAdmin>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "clients", element: <ClientsPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "sales", element: <SalesPage /> },
      { path: "quotes", element: <QuotesPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);