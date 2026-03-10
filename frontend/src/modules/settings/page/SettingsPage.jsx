import { useEffect, useState } from "react";
import { toast } from "sonner";
import { brandsApi } from "@/services/brands.api";
import { categoriesApi } from "@/services/categories.api";
import { SettingsView } from "../ui/SettingsView";

export function SettingsPage() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [b, c] = await Promise.all([
          brandsApi.getAll(),
          categoriesApi.getAll()
        ]);
        setBrands(b ?? []);
        setCategories(c ?? []);
      } catch (error) {
        toast.error("Error al cargar configuración");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddBrand = async (name) => {
    try {
      const created = await brandsApi.create({ name });
      setBrands(prev => [...prev, created]);
      toast.success("Marca agregada");
    } catch (error) {
      toast.error("Error al agregar marca");
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await brandsApi.delete(id);
      setBrands(prev => prev.filter(b => b.id !== id));
      toast.success("Marca eliminada");
    } catch (error) {
      toast.error("Error al eliminar marca");
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const created = await categoriesApi.create({ name });
      setCategories(prev => [...prev, created]);
      toast.success("Categoría agregada");
    } catch (error) {
      toast.error("Error al agregar categoría");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Categoría eliminada");
    } catch (error) {
      toast.error("Error al eliminar categoría");
    }
  };

  return (
    <SettingsView
      brands={brands}
      onAddBrand={handleAddBrand}
      onDeleteBrand={handleDeleteBrand}
      categories={categories}
      onAddCategory={handleAddCategory}
      onDeleteCategory={handleDeleteCategory}
      loading={loading}
    />
  );
}