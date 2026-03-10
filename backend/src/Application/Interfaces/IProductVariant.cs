using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IProductVariantService
{
    Task<List<ProductVariantDto>> GetAllVariantsAsync();
    Task<List<ProductVariantDto>> GetVariantsByProductAsync(int productId);
    Task<ProductVariantDto> GetVariantByIdAsync(int id);
    Task<ProductVariantDto> CreateVariantAsync(ProductVariantRequest product);
    Task<ProductVariantDto> UpdateVariantAsync(int id, UpdateProductVariantRequest product);
    Task DeleteVariantAsync(int id);
    Task<PagedResult<ProductVariantDto>> GetVariantsPagedByBrandAsync(int page, int pageSize);
}