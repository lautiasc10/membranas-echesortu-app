import {
    getPagedOffers,
    getActiveOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    uploadOfferImage
} from "../../../services/offers.api";

export const offersRepository = {
    async listPaged(params) {
        const data = await getPagedOffers(params);
        return data ?? { data: [], totalCount: 0, totalPages: 1 };
    },

    async getActive() {
        const data = await getActiveOffers();
        return data ?? [];
    },

    async getById(id) {
        return await getOfferById(id);
    },

    async create(payload) {
        const { _imageFile, ...rest } = payload;
        const data = await createOffer(rest);

        if (_imageFile) {
            return await uploadOfferImage(data.id, _imageFile);
        }

        return data;
    },

    async update(id, payload) {
        const { _imageFile, ...rest } = payload;
        const data = await updateOffer(id, rest);

        if (_imageFile) {
            return await uploadOfferImage(id, _imageFile);
        }

        return data;
    },

    async remove(id) {
        await deleteOffer(id);
        return true;
    },
};