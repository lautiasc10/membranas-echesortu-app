using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IProductService
{
    Task<List<ProductDto>> GetAllProductsAsync();
    Task<ProductDto> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(ProductRequest product);
    Task<ProductDto> UpdateProductAsync(int id, UpdateProductRequest product);
    Task DeleteProductAsync(int id);
    Task<List<ProductDto>> GetTopSellingProductsAsync(int count = 6);
    Task<PagedResult<ProductWithVariantsDto>> GetPagedProductsAsync(int page, int pageSize, string? search, string? brand, string? category, string? sort);
}