using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IBrandService
{
    Task<List<BrandDto>> GetAllBrandsAsync();
    Task<BrandDto> GetBrandByIdAsync(int id);
    Task<BrandDto> CreateBrandAsync(CreateBrandRequest request);
    Task DeleteBrandAsync(int id);
    Task<PagedResult<BrandDto>> GetPagedBrandsAsync(int page, int pageSize, string? search, string? sort);
}
