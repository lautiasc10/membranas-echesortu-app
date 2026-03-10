import { useRouteError, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error(error);

    return (
        <div className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
            <div className="max-w-md w-full">
                <div className="size-20 bg-red-100 text-red-600 rounded-full grid place-items-center mx-auto mb-6 shadow-sm">
                    <AlertCircle className="size-10" />
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                    ¡Ups! Algo salió mal
                </h1>

                <p className="text-slate-500 mb-8 leading-relaxed">
                    {error?.statusText || error?.message || "Lo sentimos, ocurrió un error inesperado en la aplicación."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="default"
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 h-11 px-8"
                        onClick={() => navigate("/")}
                    >
                        <Home className="size-4" />
                        Volver al Inicio
                    </Button>

                    <Button
                        variant="outline"
                        className="gap-2 h-11 px-8 border-slate-200"
                        onClick={() => window.location.reload()}
                    >
                        <RotateCcw className="size-4" />
                        Reintentar
                    </Button>
                </div>

                {error?.status === 404 && (
                    <p className="mt-12 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Error 404: Página no encontrada
                    </p>
                )}
            </div>
        </div>
    );
}
