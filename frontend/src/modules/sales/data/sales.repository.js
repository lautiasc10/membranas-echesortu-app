// src/modules/sales/data/sales.repository.js
import { getClients, createClient } from "../../../services/clients.api";
import { getAllVariants } from "../../../services/variants.api";
import {
  createSale,
  getSales,
  getPagedSales,
  getSaleById,
  deleteSale,
  updateSale,
} from "../../../services/sales.api";

export const salesRepository = {
  async listClients() {
    const data = await getClients();
    return data ?? [];
  },

  async createGuestClient(payload) {
    const data = await createClient(payload);
    return data;
  },

  async listAllVariants({ pageSize = 500 } = {}) {
    const first = await getAllVariants(1, pageSize);

    const firstData = first?.data ?? first?.Data ?? [];
    const totalPages = first?.totalPages ?? first?.TotalPages ?? 1;

    if (totalPages <= 1) return firstData;

    const pages = [];
    for (let p = 2; p <= totalPages; p++) pages.push(getAllVariants(p, pageSize));

    const rest = await Promise.all(pages);
    const restData = rest.flatMap((x) => x?.data ?? x?.Data ?? []);

    return [...firstData, ...restData];
  },

  async createSale(payload) {
    const data = await createSale(payload);
    return data;
  },

  // ✅ NUEVO: listado ventas
  async listSales() {
    const data = await getSales();
    return data ?? [];
  },

  async listSalesPaged(params) {
    const data = await getPagedSales(params);
    return data ?? { data: [], totalCount: 0, totalPages: 1 };
  },

  // ✅ NUEVO: obtener venta
  async readSale(id) {
    const data = await getSaleById(id);
    return data;
  },

  // ✅ NUEVO: eliminar
  async deleteSale(id) {
    const data = await deleteSale(id);
    return data;
  },

  // ✅ NUEVO: actualizar
  async updateSale(id, payload) {
    const data = await updateSale(id, payload);
    return data;
  },
};