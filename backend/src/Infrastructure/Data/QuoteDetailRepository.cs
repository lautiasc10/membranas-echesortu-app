using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Data;

public class QuoteDetailRepository : Repository<QuoteDetail>, IQuoteDetailRepository
{
    public QuoteDetailRepository(ApplicationDbContext context) : base(context)
    {
    }
}
