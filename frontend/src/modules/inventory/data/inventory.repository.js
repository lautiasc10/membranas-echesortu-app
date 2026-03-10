import { getAllVariants } from "../../../services/variants.api";

/**
 * Carga todas las variantes paginadas del backend.
 * pageSize alto para reducir requests.
 */
export const inventoryRepository = {
  async listAll({ pageSize = 500 } = {}) {
    const first = await getAllVariants(1, pageSize);

    const firstData = first?.data ?? first?.Data ?? [];
    const totalPages = first?.totalPages ?? first?.TotalPages ?? 1;

    if (totalPages <= 1) return firstData;

    const pages = [];
    for (let p = 2; p <= totalPages; p++) {
      pages.push(getAllVariants(p, pageSize));
    }

    const rest = await Promise.all(pages);
    const restData = rest.flatMap((x) => x?.data ?? x?.Data ?? []);

    return [...firstData, ...restData];
  },
};