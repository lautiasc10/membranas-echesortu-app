using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class GalleryRepository : Repository<GalleryProject>, IGalleryRepository
{
    public GalleryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<(List<GalleryProject> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, bool onlyVisible)
    {
        var query = _dbSet.AsQueryable();

        if (onlyVisible)
        {
            query = query.Where(g => g.IsVisible);
        }

        query = query.OrderBy(g => g.OrderIndex).ThenByDescending(g => g.CreatedAt);

        var totalCount = await query.CountAsync();

        var data = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (data, totalCount);
    }
}
