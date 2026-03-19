using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class OfferRepository : Repository<Offer>, IOfferRepository
{
    public OfferRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<(List<Offer> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, bool onlyActive)
    {
        var query = _dbSet
            .Include(o => o.Product)
            .Include(o => o.ProductVariant)
            .AsQueryable();

        var now = DateTime.UtcNow;

        if (onlyActive)
        {
            query = query.Where(o => o.IsActive && o.StartDate <= now && o.EndDate >= now);
        }

        query = query.OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync();

        var data = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (data, totalCount);
    }

    public async Task<List<Offer>> GetActiveOffersAsync(DateTime currentDate)
    {
        return await _dbSet
            .Include(o => o.Product)
            .Include(o => o.ProductVariant)
            .Where(o => o.IsActive && o.StartDate <= currentDate && o.EndDate >= currentDate)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }
}
