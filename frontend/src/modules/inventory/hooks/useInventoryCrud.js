import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../../services/products.api";
import { getVariantById, updateVariant } from "../../../services/variants.api";

export function useInventoryCrud({ onRefresh }) {
  async function run(fn) {
    const res = await fn();
    await onRefresh?.();
    return res;
  }

  // PRODUCTS
  const create = (payload) => run(() => createProduct(payload));
  const update = (id, payload) => run(() => updateProduct(id, payload));
  const remove = (id) => run(() => deleteProduct(id));
  const uploadImage = (productId, file) =>
    run(() => uploadProductImage(productId, file));

  // VARIANTS
  const getVariant = (id) => getVariantById(id); // read only
  const updateVar = (id, payload) => run(() => updateVariant(id, payload));

  return { create, update, remove, uploadImage, getVariant, updateVar };
}