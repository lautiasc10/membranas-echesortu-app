using Domain.Entities;

namespace Domain.Interfaces;

public interface ISaleDetailRepository : IRepository<SaleDetail>
{
    Task<IEnumerable<SaleDetail>> GetBySaleAsync(int saleId);
    Task<List<int>> GetTopSellingProductIdsAsync(int count);
}