using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllCategoriesAsync();
    Task<CategoryDto> GetCategoryByIdAsync(int id);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request);
    Task DeleteCategoryAsync(int id);
    Task<PagedResult<CategoryDto>> GetPagedCategoriesAsync(int page, int pageSize, string? search, string? sort);
}
