import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export function Pagination({ page, totalPages, onPrev, onNext, onGoPage }) {
    const pages = useMemo(() => {
        // simple: muestra hasta 5 botones numéricos
        const arr = [];
        const max = Math.max(1, totalPages);

        // Si hay mucas páginas, centramos alrededor de la actual
        let start = Math.max(1, page - 2);
        let end = Math.min(max, start + 4);

        if (end - start < 4) {
            start = Math.max(1, end - 4);
        }

        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
    }, [totalPages, page]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
                Anterior
            </Button>

            <div className="hidden sm:flex items-center gap-1">
                {pages.map((p) => (
                    <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onGoPage(p)}
                    >
                        {p}
                    </Button>
                ))}
            </div>

            <span className="text-sm font-semibold mx-2 sm:hidden">
                Pag. {page} / {totalPages}
            </span>

            <Button variant="outline" size="sm" onClick={onNext} disabled={page >= totalPages}>
                Siguiente
            </Button>
        </div>
    );
}
