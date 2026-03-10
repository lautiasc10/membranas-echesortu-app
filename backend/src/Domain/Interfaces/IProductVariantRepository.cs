using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IProductVariantRepository : IRepository<ProductVariant>
    {
        Task<List<ProductVariant>> GetByProductIdAsync(int productId);
        Task<List<ProductVariant>> GetAllWithProductAsync();
    }
}