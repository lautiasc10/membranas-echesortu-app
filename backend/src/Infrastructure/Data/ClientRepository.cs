using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.Extensions;

namespace Infrastructure.Data
{
    public class ClientRepository : Repository<Client>, IClientRepository
    {
        public ClientRepository(ApplicationDbContext applicationDbContext)
            : base(applicationDbContext) { }

        public async Task<Client?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Email == email);
        }

        public override async Task<IEnumerable<Client>> ListAsync()
        {
            return await _dbSet.Include(c => c.Sales).ToListAsync();
        }

        public async Task<Client?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.IsGuest && c.Name == name);
        }

        public async Task<Client?> GetByRefreshTokenAsync(string refreshToken)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.RefreshToken == refreshToken);
        }

        public async Task<(List<Client> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? sort)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(c => 
                    c.Name.ToLower().Contains(lowerSearch) ||
                    c.Email.ToLower().Contains(lowerSearch)
                );
            }

            if (sort == "name_asc")
                query = query.OrderBy(c => c.Name);
            else if (sort == "name_desc")
                query = query.OrderByDescending(c => c.Name);
            else
                query = query.OrderByDescending(c => c.Id);

            return await query.GetPagedAsync(page, pageSize);
        }
    }
}