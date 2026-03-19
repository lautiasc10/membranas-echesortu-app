using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepository.ListAsync();
        return categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList();
    }

    public async Task<CategoryDto> GetCategoryByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("CATEGORY_NOT_FOUND");
        return new CategoryDto(category.Id, category.Name);
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new AppValidationException("CATEGORY_NAME_REQUIRED");

        var category = new Category(request.Name);
        _categoryRepository.Add(category);
        await _unitOfWork.SaveChangesAsync();

        return new CategoryDto(category.Id, category.Name);
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("CATEGORY_NOT_FOUND");

        _categoryRepository.Delete(category);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<PagedResult<CategoryDto>> GetPagedCategoriesAsync(int page, int pageSize, string? search, string? sort)
    {
        var (categories, totalCount) = await _categoryRepository.GetPagedAsync(page, pageSize, search, sort);

        return new PagedResult<CategoryDto>
        {
            Data = categories.Select(c => new CategoryDto(c.Id, c.Name)).ToList(),
            TotalCount = totalCount,
            Page = page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }
}
