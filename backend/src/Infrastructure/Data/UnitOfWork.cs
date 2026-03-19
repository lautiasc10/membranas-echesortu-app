using Domain.Interfaces;
using Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConcurrencyException("Los datos modificados fueron cambiados concurrentemente por otro usuario. Por favor, actualice la información e intente de nuevo.");
        }
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
