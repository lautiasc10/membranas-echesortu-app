import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "../components/ui/toaster";
import { AuthProvider } from "../shared/context/AuthContext";
import { CartProvider } from "../shared/context/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Opcional: no refrescar al volver a la pestaña
      retry: 1
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}