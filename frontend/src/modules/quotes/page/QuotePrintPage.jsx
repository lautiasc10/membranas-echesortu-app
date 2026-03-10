import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quotesRepository } from "../data/quotes.repository";
import logo from "@/img/logo-membrana.png";

const currency = (n) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(n ?? 0);

const formatDate = (x) => {
    if (!x) return "";
    return new Date(x).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export function QuotePrintPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await quotesRepository.readQuote(id);
                setQuote(data);
            } catch (e) {
                console.error("No se pudo cargar", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    useEffect(() => {
        if (quote && !loading) {
            setTimeout(() => {
                window.print();
            }, 500); // Darle tiempo a renderizar
        }
    }, [quote, loading]);

    if (loading) {
        return <div className="p-10 font-sans text-xl">Preparando documento...</div>;
    }

    if (!quote) {
        return (
            <div className="p-10 font-sans text-xl text-red-600">
                Presupuesto no encontrado.{" "}
                <button className="underline" onClick={() => navigate("/admin/quotes")}>
                    Volver
                </button>
            </div>
        );
    }

    // Llenar "líneas vacías" para igualar diseño visual del excel
    const minRows = 15;
    const emptyRows = Math.max(0, minRows - quote.details.length);
    const rowsToRender = [
        ...quote.details,
        ...Array.from({ length: emptyRows }).map((_, i) => ({
            id: `empty-${i}`,
            isEmpty: true,
        })),
    ];

    return (
        <div className="bg-white text-black min-h-screen font-sans p-8 print:p-0">
            {/* Botón flotante para impresión manual y volver */}
            <div className="print:hidden mb-6 flex gap-4">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow-md"
                >
                    Reimprimir PDF
                </button>
                <button
                    onClick={() => navigate("/admin/quotes")}
                    className="bg-gray-200 text-black px-4 py-2 rounded shadow-md"
                >
                    Volver a Presupuestos
                </button>
            </div>

            <div className="max-w-[210mm] mx-auto bg-white" style={{ width: "210mm", height: "297mm" }}>
                {/* Cabecera Tipo Excel */}
                <div className="grid grid-cols-[3fr_2fr] border border-black border-b-0">
                    <div className="flex flex-col items-center justify-center p-4 border-r border-black relative">
                        <img src={logo} alt="Logo" className="h-16 object-contain mb-2" />
                        <div className="text-sm absolute bottom-2 left-4">
                            <p>📍 San Juan 3451 - Rosario - Santa Fe</p>
                            <p>📞 Tel: 3416914801 / 3416900672 / 3413761473</p>
                            <p>✉️ Email: cgonzalezycia@hotmail.com</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 flex flex-col justify-center font-bold text-sm">
                        <div className="text-xl mb-2">PRESUPUESTO N° {quote.id}</div>
                        <div className="flex border-t border-black pt-1 mt-1">
                            <span className="w-24">FECHA:</span> <span className="font-normal">{formatDate(quote.date)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24">CLIENTE:</span> <span className="font-normal uppercase">{quote.clientName}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24">DOMICILIO:</span> <span className="font-normal uppercase">{quote.clientAddress}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24">CIUDAD:</span> <span className="font-normal uppercase">{quote.clientCity}</span>
                        </div>
                        <div className="flex border-b-0 pb-1 mb-1">
                            <span className="w-48 leading-tight">UBICACIÓN DE LA OBRA:</span> <span className="font-normal uppercase block pt-1">{quote.workLocation}</span>
                        </div>
                    </div>
                </div>

                {/* Tabla principal */}
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-1 text-center font-bold w-[50%]">PRODUCTO</th>
                            <th className="border border-black p-1 text-center font-bold w-[12%]">CANTIDAD</th>
                            <th className="border border-black p-1 text-center font-bold w-[19%]">PRECIO UNITARIO</th>
                            <th className="border border-black p-1 text-center font-bold w-[19%]">PRECIO TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsToRender.map((row) => (
                            <tr key={row.id} className="h-6">
                                <td className="border border-black px-2 py-1 uppercase">{row.isEmpty ? "" : row.productName}</td>
                                <td className="border border-black px-2 py-1 text-right">{row.isEmpty ? "" : row.quantity}</td>
                                <td className="border border-black px-2 py-1 text-right whitespace-nowrap">
                                    {row.isEmpty ? "" : currency(row.unitPrice)}
                                </td>
                                <td className="border border-black px-2 py-1 text-right whitespace-nowrap bg-gray-50/50">
                                    {row.isEmpty ? currency(0) : currency(row.subtotal)}
                                </td>
                            </tr>
                        ))}
                        {/* Fila del Total */}
                        <tr>
                            <td colSpan={3} className="border border-black px-2 py-2 text-center font-bold text-base">
                                TOTAL
                            </td>
                            <td className="border border-black px-2 py-2 text-right font-bold text-base bg-gray-100">
                                {currency(quote.total)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Pie de página */}
                <div className="mt-8 text-sm font-semibold uppercase">
                    PRECIOS DE CONTADO O TRANSFERENCIA RETIRADO DE DEPOSITO
                </div>
            </div>
        </div>
    );
}
