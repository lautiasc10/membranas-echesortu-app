namespace Application.Models;

public class PagedResult<T>
{
    public List<T> Data { get; set; } = [];
    public int Page { get; set; }
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }
}