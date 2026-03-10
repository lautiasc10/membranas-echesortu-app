using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.Extensions;

namespace Infrastructure.Data
{
    public class BrandRepository : Repository<Brand>, IBrandRepository
    {
        public BrandRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<(List<Brand> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? sort)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(b => b.Name.ToLower().Contains(lowerSearch));
            }

            if (sort == "name_asc")
                query = query.OrderBy(b => b.Name);
            else if (sort == "name_desc")
                query = query.OrderByDescending(b => b.Name);
            else
                query = query.OrderBy(b => b.Name);

            return await query.GetPagedAsync(page, pageSize);
        }
    }
}