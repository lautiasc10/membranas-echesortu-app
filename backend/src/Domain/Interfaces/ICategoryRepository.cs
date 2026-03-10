using Domain.Entities;

namespace Domain.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<(List<Category> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? sort);
    }
}