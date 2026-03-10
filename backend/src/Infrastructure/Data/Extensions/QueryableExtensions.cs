using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Extensions;

public static class QueryableExtensions
{
    public static async Task<(List<T> Data, int TotalCount)> GetPagedAsync<T>(
        this IQueryable<T> query, int page, int pageSize)
    {
        var totalCount = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (data, totalCount);
    }
}
