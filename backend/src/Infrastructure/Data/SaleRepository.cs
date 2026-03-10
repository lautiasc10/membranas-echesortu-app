using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.Extensions;

namespace Infrastructure.Data;

public class SaleRepository : Repository<Sale>, ISaleRepository
{
    public SaleRepository(ApplicationDbContext context) : base(context) { }

    public override async Task<IEnumerable<Sale>> ListAsync()
    {
        return await _dbSet
                .Include(s => s.SaleDetails)
                .ThenInclude(d => d.ProductVariant)
            .Include(s => s.Client)
            .ToListAsync();
    }

        public override async Task<Sale?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(s => s.SaleDetails)
                    .ThenInclude(d => d.ProductVariant)
                .Include(s => s.Client)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<(List<Sale> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? status, DateTime? fromDate, DateTime? toDate, string? sort)
        {
            var query = _dbSet
                .Include(s => s.SaleDetails)
                    .ThenInclude(d => d.ProductVariant)
                .Include(s => s.Client)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(s => 
                    (s.Client != null && s.Client.Name.ToLower().Contains(lowerSearch)) ||
                    s.Id.ToString() == search
                );
            }

            

            if (fromDate.HasValue)
                query = query.Where(s => s.Date >= fromDate.Value);
                
            if (toDate.HasValue)
            {
                var targetToDate = toDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(s => s.Date <= targetToDate);
            }

            if (sort == "date_asc")
                query = query.OrderBy(s => s.Date);
            else if (sort == "total_asc")
                query = query.OrderBy(s => s.Total);
            else if (sort == "total_desc")
                query = query.OrderByDescending(s => s.Total);
            else // date_desc default
                query = query.OrderByDescending(s => s.Date);

            return await query.GetPagedAsync(page, pageSize);
        }
    }