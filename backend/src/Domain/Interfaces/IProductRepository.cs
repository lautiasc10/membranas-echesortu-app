using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetProductsForListAsync();
        Task<Product?> GetProductDetailAsync(int id);
        Task<List<Product>> GetByIdsAsync(List<int> ids);
        Task<(List<Product> Products, int TotalCount)> GetPagedProductsAsync(int page, int pageSize, string? search, string? brand, string? category, string? sort);
    }
}