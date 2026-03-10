import { getClients, getPagedClients, deleteClient, createClient, updateClient } from "../../../services/clients.api";
import { getSales } from "../../../services/sales.api";

export const clientsRepository = {
  async list() {
    const data = await getClients();
    return data ?? [];
  },

  async listPaged(params) {
    const data = await getPagedClients(params);
    return data ?? { data: [], totalCount: 0, totalPages: 1 };
  },

  async listSales() {
    const data = await getSales();
    return data ?? [];
  },

  async create(payload) {
    // payload: { name, email? }
    const data = await createClient(payload);
    return data;
  },

  async update(id, payload) {
    // payload patch: { name?, phoneNumber?, email? }
    const data = await updateClient(id, payload);
    return data;
  },

  async remove(id) {
    await deleteClient(id);
    return true;
  },
};