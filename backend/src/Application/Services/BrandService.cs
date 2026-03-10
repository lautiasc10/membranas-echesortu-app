using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class BrandService : IBrandService
{
    private readonly IBrandRepository _brandRepository;
    private readonly IUnitOfWork _unitOfWork;

    public BrandService(IBrandRepository brandRepository, IUnitOfWork unitOfWork)
    {
        _brandRepository = brandRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<BrandDto>> GetAllBrandsAsync()
    {
        var brands = await _brandRepository.ListAsync();
        return brands.Select(b => new BrandDto(b.Id, b.Name ?? string.Empty)).ToList();
    }

    public async Task<BrandDto> GetBrandByIdAsync(int id)
    {
        var brand = await _brandRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("BRAND_NOT_FOUND");
        return new BrandDto(brand.Id, brand.Name ?? string.Empty);
    }

    public async Task<BrandDto> CreateBrandAsync(CreateBrandRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new AppValidationException("BRAND_NAME_REQUIRED");

        var brand = new Brand(request.Name);
        _brandRepository.Add(brand);
        await _unitOfWork.SaveChangesAsync();

        return new BrandDto(brand.Id, brand.Name ?? string.Empty);
    }

    public async Task DeleteBrandAsync(int id)
    {
        var brand = await _brandRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("BRAND_NOT_FOUND");

        _brandRepository.Delete(brand);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<PagedResult<BrandDto>> GetPagedBrandsAsync(int page, int pageSize, string? search, string? sort)
    {
        var (brands, totalCount) = await _brandRepository.GetPagedAsync(page, pageSize, search, sort);

        return new PagedResult<BrandDto>
        {
            Data = brands.Select(b => new BrandDto(b.Id, b.Name ?? string.Empty)).ToList(),
            TotalCount = totalCount,
            Page = page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }
}
