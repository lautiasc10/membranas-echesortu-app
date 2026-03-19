using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.Extensions;

namespace Infrastructure.Data
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Product>> GetProductsForListAsync()
        {
            return await _dbSet
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Where(p => p.Active)
                .ToListAsync();
        }

        public async Task<Product?> GetProductDetailAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.ProductVariants)
                .AsSplitQuery()
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Product>> GetByIdsAsync(List<int> ids)
        {
            return await _dbSet
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();
        }

        public async Task<(List<Product> Products, int TotalCount)> GetPagedProductsAsync(int page, int pageSize, string? search, string? brand, string? category, string? sort)
        {
            var query = _dbSet
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.ProductVariants)
                .AsSplitQuery()
                .Where(p => p.Active)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(brand) && brand.ToLower() != "all")
            {
                query = query.Where(p => p.Brand != null && p.Brand.Name.ToLower() == brand.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(category) && category.ToLower() != "all")
            {
                query = query.Where(p => p.Category != null && p.Category.Name.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(lowerSearch) ||
                    (p.Brand != null && p.Brand.Name.ToLower().Contains(lowerSearch)) ||
                    (p.Category != null && p.Category.Name.ToLower().Contains(lowerSearch)) ||
                    p.ProductVariants.Any(v => 
                        (v.Weight ?? "").ToLower().Contains(lowerSearch) ||
                        (v.Color ?? "").ToLower().Contains(lowerSearch) ||
                        (v.Size ?? "").ToLower().Contains(lowerSearch)
                    )
                );
            }

            // Default sorting placeholder logic (for now, fallback to Id). Real frontend does 'priority', 'price_asc', 'price_desc'
            // We'll mimic price sorting via variants or fallback.
            if (sort == "price_asc")
            {
                query = query.OrderBy(p => p.ProductVariants.Min(v => v.SalePrice));
            }
            else if (sort == "price_desc")
            {
                query = query.OrderByDescending(p => p.ProductVariants.Max(v => v.SalePrice));
            }
            else 
            {
                // Priority (Megaflex 1st, Kovertech 2nd, others 3rd) and then by Id
                query = query.OrderBy(p => 
                        p.Brand != null && p.Brand.Name.ToLower() == "megaflex" ? 1 :
                        p.Brand != null && p.Brand.Name.ToLower() == "kovertech" ? 2 : 3
                    )
                    .ThenBy(p => p.Id);
            }

            var result = await query.GetPagedAsync(page, pageSize);
            return (result.Data, result.TotalCount);
        }
    }
}