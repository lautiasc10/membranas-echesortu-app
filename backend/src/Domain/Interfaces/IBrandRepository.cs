using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IBrandRepository : IRepository<Brand>
    {
        Task<(List<Brand> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? sort);
    }
}