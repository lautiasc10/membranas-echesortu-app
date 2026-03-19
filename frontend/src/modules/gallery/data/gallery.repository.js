import {
    getPagedGallery,
    getGalleryById,
    createGalleryProject,
    updateGalleryProject,
    deleteGalleryProject,
    uploadGalleryBeforeImage,
    uploadGalleryAfterImage
} from "../../../services/gallery.api";

export const galleryRepository = {
    async listPaged(params) {
        const data = await getPagedGallery(params);
        return data ?? { data: [], totalCount: 0, totalPages: 1 };
    },

    async getById(id) {
        return await getGalleryById(id);
    },

    async create(payload) {
        const { _beforeImage, _afterImage, ...rest } = payload;
        let data = await createGalleryProject(rest);

        if (_beforeImage) {
            data = await uploadGalleryBeforeImage(data.id, _beforeImage);
        }

        if (_afterImage) {
            data = await uploadGalleryAfterImage(data.id, _afterImage);
        }

        return data;
    },

    async update(id, payload) {
        const { _beforeImage, _afterImage, ...rest } = payload;
        let data = await updateGalleryProject(id, rest);

        if (_beforeImage) {
            data = await uploadGalleryBeforeImage(id, _beforeImage);
        }

        if (_afterImage) {
            data = await uploadGalleryAfterImage(id, _afterImage);
        }

        return data;
    },

    async remove(id) {
        await deleteGalleryProject(id);
        return true;
    },
};