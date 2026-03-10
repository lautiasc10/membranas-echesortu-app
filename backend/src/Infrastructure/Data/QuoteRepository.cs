using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class QuoteRepository : Repository<Quote>, IQuoteRepository
{
    public QuoteRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Quote>> ListAsync()
    {
        return await _dbSet
            .Include(q => q.QuoteDetails)
            .ToListAsync();
    }

    public override async Task<Quote?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(q => q.QuoteDetails)
            .FirstOrDefaultAsync(q => q.Id == id);
    }
}
