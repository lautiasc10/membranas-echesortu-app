import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Shared Delete Confirmation Dialog
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {function} props.onOpenChange - Callback when open state changes
 * @param {function} props.onConfirm - Callback when confirm button is clicked
 * @param {string} [props.title] - Dialog title
 * @param {string} [props.description] - Dialog description
 * @param {boolean} [props.busy] - Whether the action is in progress
 */
export function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Confirmar eliminación",
    description = "Esta acción no se puede deshacer. ¿Seguro que querés eliminar este elemento?",
    busy = false,
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[95vw] sm:max-w-[420px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={busy}
                        onClick={(e) => {
                            // Prevent closing automatically if we want to handle it manually or wait for async
                            // But shadcn AlertDialogAction closes on click by default unless we prevent default
                            onConfirm();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {busy ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
