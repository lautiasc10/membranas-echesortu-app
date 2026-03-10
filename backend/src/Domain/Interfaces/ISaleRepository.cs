using Domain.Entities;

namespace Domain.Interfaces;

public interface ISaleRepository : IRepository<Sale>
{
    Task<(List<Sale> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? status, DateTime? fromDate, DateTime? toDate, string? sort);
}