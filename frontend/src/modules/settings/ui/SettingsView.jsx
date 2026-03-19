import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Store, Tag, ShieldCheck, Globe } from "lucide-react";

export function SettingsView({
    brands,
    onAddBrand,
    onDeleteBrand,
    categories,
    onAddCategory,
    onDeleteCategory,
    loading
}) {
    const [newBrand, setNewBrand] = useState("");
    const [newCategory, setNewCategory] = useState("");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl">Configuración</h1>
                <p className="text-muted-foreground mt-1">
                    Administrá los parámetros generales del sistema y los catálogos de inventario.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-emerald-500/5 border">
                    <TabsTrigger value="general" className="gap-2">
                        <Store className="size-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="inventory" className="gap-2">
                        <Tag className="size-4" /> Inventario
                    </TabsTrigger>
                    <TabsTrigger value="account" className="gap-2">
                        <ShieldCheck className="size-4" /> Seguridad
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Globe className="size-4 text-emerald-600" /> Datos del Comercio
                                </CardTitle>
                                <CardDescription>Información que aparece en comprobantes y reportes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label>Nombre del Negocio</Label>
                                    <Input defaultValue="Membranas Echesortu" readOnly className="bg-slate-50" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Dirección</Label>
                                    <Input defaultValue="Rosario, Santa Fe, Argentina" readOnly className="bg-slate-50" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Moneda Principal</Label>
                                    <Input defaultValue="Pesos Argentinos (ARS)" readOnly className="bg-slate-50" />
                                </div>
                                <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                                    Editar (Próximamente)
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Store className="size-4 text-emerald-600" /> Preferencias de Ventas
                                </CardTitle>
                                <CardDescription>Configuración del módulo de facturación rápida.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm">Impresión Automática</Label>
                                        <p className="text-xs text-muted-foreground">Generar PDF al confirmar venta.</p>
                                    </div>
                                    <Badge variant="outline">Desactivado</Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm">Control de Stock Crítico</Label>
                                        <p className="text-xs text-muted-foreground">Alertar cuando un item llegue a cero.</p>
                                    </div>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Activo</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* MARCAS */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Marcas</CardTitle>
                                <CardDescription>Gestioná los fabricantes de tus productos.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Nueva marca..."
                                        value={newBrand}
                                        onChange={(e) => setNewBrand(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && newBrand.trim()) {
                                                onAddBrand(newBrand.trim());
                                                setNewBrand("");
                                            }
                                        }}
                                    />
                                    <Button
                                        size="icon"
                                        disabled={!newBrand.trim() || loading}
                                        onClick={() => {
                                            onAddBrand(newBrand.trim());
                                            setNewBrand("");
                                        }}
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>

                                <div className="space-y-1 border rounded-md max-h-[300px] overflow-y-auto p-1">
                                    {brands.length === 0 ? (
                                        <p className="p-4 text-center text-xs text-muted-foreground italic">No hay marcas registradas.</p>
                                    ) : (
                                        brands.map((b) => (
                                            <div key={b.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded group">
                                                <span className="text-sm font-medium">{b.name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => onDeleteBrand(b.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* CATEGORIAS */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Categorías</CardTitle>
                                <CardDescription>Organizá tus productos por rubros.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Nueva categoría..."
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && newCategory.trim()) {
                                                onAddCategory(newCategory.trim());
                                                setNewCategory("");
                                            }
                                        }}
                                    />
                                    <Button
                                        size="icon"
                                        disabled={!newCategory.trim() || loading}
                                        onClick={() => {
                                            onAddCategory(newCategory.trim());
                                            setNewCategory("");
                                        }}
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>

                                <div className="space-y-1 border rounded-md max-h-[300px] overflow-y-auto p-1">
                                    {categories.length === 0 ? (
                                        <p className="p-4 text-center text-xs text-muted-foreground italic">No hay categorías registradas.</p>
                                    ) : (
                                        categories.map((c) => (
                                            <div key={c.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded group">
                                                <span className="text-sm font-medium">{c.name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => onDeleteCategory(c.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Seguridad y Cuenta</CardTitle>
                            <CardDescription>Opciones de acceso y perfiles de usuario.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-12 gap-4">
                            <ShieldCheck className="size-12 text-slate-200" />
                            <p className="text-sm text-muted-foreground italic">Módulo de gestión de usuarios en desarrollo.</p>
                            <Button variant="outline" disabled>Cambiar Contraseña</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
