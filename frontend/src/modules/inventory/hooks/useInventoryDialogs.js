import { useState } from "react";

export function useInventoryDialogs() {
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [productDialogMode, setProductDialogMode] = useState("create");
    const [productSelected, setProductSelected] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteSelected, setDeleteSelected] = useState(null);

    const [variantDialogOpen, setVariantDialogOpen] = useState(false);
    const [variantSelectedId, setVariantSelectedId] = useState(null);

    const [busy, setBusy] = useState(false);

    return {
        productDialogOpen, setProductDialogOpen,
        productDialogMode, setProductDialogMode,
        productSelected, setProductSelected,
        confirmOpen, setConfirmOpen,
        deleteSelected, setDeleteSelected,
        variantDialogOpen, setVariantDialogOpen,
        variantSelectedId, setVariantSelectedId,
        busy, setBusy
    };
}
