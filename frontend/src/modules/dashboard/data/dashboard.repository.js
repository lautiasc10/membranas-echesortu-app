import { getClients } from "../../../services/clients.api";
import { getSales } from "../../../services/sales.api";
import { getVariantsAll } from "../../../services/variants.api";

export const dashboardRepository = {
  async getDashboardRaw() {
    const [clients, sales, variants] = await Promise.all([
      getClients(),
      getSales(),
      getVariantsAll(),
    ]);

    return {
      clients: clients ?? [],
      sales: sales ?? [],
      variants: variants ?? [],
    };
  },
};