using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.Extensions;

namespace Infrastructure.Data
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<(List<Category> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? sort)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(c => c.Name.ToLower().Contains(lowerSearch));
            }

            if (sort == "name_asc")
                query = query.OrderBy(c => c.Name);
            else if (sort == "name_desc")
                query = query.OrderByDescending(c => c.Name);
            else
                query = query.OrderBy(c => c.Name);

            return await query.GetPagedAsync(page, pageSize);
        }
    }
}