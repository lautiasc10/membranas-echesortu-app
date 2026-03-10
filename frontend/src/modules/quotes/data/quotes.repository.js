import { getAllVariants } from "../../../services/variants.api";
import {
    getQuotes,
    getQuoteById,
    createQuote,
    updateQuote,
    deleteQuote,
} from "../../../services/quotes.api";

export const quotesRepository = {
    // To populate the products table in the form
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

    async listQuotes() {
        const data = await getQuotes();
        return data ?? [];
    },

    async readQuote(id) {
        const data = await getQuoteById(id);
        return data;
    },

    async createQuote(payload) {
        const data = await createQuote(payload);
        return data;
    },

    async updateQuote(id, payload) {
        const data = await updateQuote(id, payload);
        return data;
    },

    async deleteQuote(id) {
        const data = await deleteQuote(id);
        return data;
    },
};
