using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;
public class SaleDetailRepository : Repository<SaleDetail>, ISaleDetailRepository
{
    public SaleDetailRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<SaleDetail>> GetBySaleAsync(int saleId)
    {
        return await _dbSet
            .Include(d => d.ProductVariant)
            .Where(d => d.SaleId == saleId)
            .ToListAsync();
    }

    public async Task<List<int>> GetTopSellingProductIdsAsync(int count)
    {
        return await _dbSet
            .Include(d => d.ProductVariant)
            .GroupBy(d => d.ProductVariant.ProductId)
            .OrderByDescending(g => g.Sum(d => d.Quantity))
            .Take(count)
            .Select(g => g.Key)
            .ToListAsync();
    }
}