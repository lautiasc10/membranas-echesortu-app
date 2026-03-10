import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { quotesRepository } from "../data/quotes.repository";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Search, FileText, Printer } from "lucide-react";
import { QuoteForm } from "../ui/QuoteForm";

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

export function QuotesPage() {
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingQuoteId, setEditingQuoteId] = useState(null);

    // Data for form
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        loadList();
        loadVariants();
    }, []);

    async function loadList() {
        try {
            setLoading(true);
            const data = await quotesRepository.listQuotes();
            setQuotes(data);
        } catch (e) {
            toast.error("Error al cargar presupuestos");
        } finally {
            setLoading(false);
        }
    }

    async function loadVariants() {
        try {
            const v = await quotesRepository.listAllVariants();
            setVariants(v);
        } catch (e) {
            console.error(e);
        }
    }

    const handleOpenCreate = () => {
        setEditingQuoteId(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (id) => {
        setEditingQuoteId(id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este presupuesto?")) return;
        try {
            await quotesRepository.deleteQuote(id);
            toast.success("Presupuesto eliminado");
            loadList();
        } catch {
            toast.error("No se pudo eliminar");
        }
    };

    const handleFormSubmit = async (payload) => {
        try {
            if (editingQuoteId) {
                await quotesRepository.updateQuote(editingQuoteId, payload);
                toast.success("Presupuesto actualizado");
            } else {
                await quotesRepository.createQuote(payload);
                toast.success("Presupuesto creado");
            }
            setIsFormOpen(false);
            loadList();
        } catch (e) {
            toast.error("Error al guardar presupuesto");
        }
    };

    return (
        <div className="flex-1 p-6 lg:p-10 mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 shadow-sm">
                            <FileText className="size-6" />
                        </div>
                        Gestión de Presupuestos
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm/relaxed">
                        Crea, edita y elimina presupuestos para tus clientes.
                    </p>
                </div>

                <Button onClick={handleOpenCreate} className="gap-2 shadow-sm font-semibold h-11 px-6">
                    <Plus className="size-4" />
                    Nuevo Presupuesto
                </Button>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="hidden sm:table-cell font-semibold text-foreground">N°</TableHead>
                                <TableHead className="font-semibold text-foreground">Fecha</TableHead>
                                <TableHead className="font-semibold text-foreground">Cliente</TableHead>
                                <TableHead className="font-semibold text-foreground">Total</TableHead>
                                <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        Cargando presupuestos...
                                    </TableCell>
                                </TableRow>
                            ) : quotes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        No hay presupuestos registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                quotes.map((q) => (
                                    <TableRow key={q.id} className="transition-colors hover:bg-muted/50">
                                        <TableCell className="hidden sm:table-cell font-medium text-foreground">#{q.id}</TableCell>
                                        <TableCell>{formatDate(q.date)}</TableCell>
                                        <TableCell>{q.clientName || "Sin nombre"}</TableCell>
                                        <TableCell className="font-semibold text-foreground">{currency(q.total)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/admin/quotes/${q.id}/print`)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="Imprimir / PDF"
                                                >
                                                    <Printer className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenEdit(q.id)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(q.id)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingQuoteId ? "Editar Presupuesto" : "Nuevo Presupuesto"}
                        </DialogTitle>
                        <DialogDescription>
                            Completá los datos del cliente y agregá los productos.
                        </DialogDescription>
                    </DialogHeader>

                    {isFormOpen && (
                        <QuoteForm
                            quoteId={editingQuoteId}
                            variants={variants}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
