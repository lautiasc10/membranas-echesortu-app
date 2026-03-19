using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class ProductVariantService : IProductVariantService
{
    private readonly IProductVariantRepository _variantRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductVariantService(
        IProductVariantRepository variantRepository,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork)
    {
        _variantRepository = variantRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<ProductVariantDto>> GetAllVariantsAsync()
    {
        var variants = await _variantRepository.GetAllWithProductAsync();
        return ProductVariantDto.CreateList(variants);
    }

    public async Task<List<ProductVariantDto>> GetVariantsByProductAsync(int productId)
    {
        if (!await _productRepository.ExistsAsync(productId))
            throw new NotFoundException("PRODUCT_NOT_FOUND");

        var variants = await _variantRepository.GetByProductIdAsync(productId);
        return ProductVariantDto.CreateList(variants);
    }

    public async Task<ProductVariantDto> GetVariantByIdAsync(int id)
    {
        var variant = await _variantRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("VARIANT_NOT_FOUND");

        return ProductVariantDto.Create(variant);
    }

    public async Task<ProductVariantDto> CreateVariantAsync(ProductVariantRequest request)
    {
        if (!await _productRepository.ExistsAsync(request.ProductId))
            throw new NotFoundException("PRODUCT_NOT_FOUND");

        if (request.SalePrice < 0 || request.PurchasePrice < 0)
            throw new AppValidationException("INVALID_PRICE");

        if (request.CurrentStock < 0 || request.MinimumStock < 0)
            throw new AppValidationException("INVALID_STOCK");

        var variant = new ProductVariant(
            request.ProductId,
            request.Weight,
            request.Color,
            request.Size,
            request.SalePrice,
            request.PurchasePrice,
            request.CurrentStock,
            request.MinimumStock,
            request.ImageUrl
        );

        _variantRepository.Add(variant);
        await _unitOfWork.SaveChangesAsync();

        return ProductVariantDto.Create(variant);
    }

    public async Task<ProductVariantDto> UpdateVariantAsync(int id, UpdateProductVariantRequest request)
    {
        var variant = await _variantRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("VARIANT_NOT_FOUND");

        if (request.SalePrice.HasValue && request.SalePrice < 0)
            throw new AppValidationException("INVALID_SALE_PRICE");

        if (request.PurchasePrice.HasValue && request.PurchasePrice < 0)
            throw new AppValidationException("INVALID_PURCHASE_PRICE");

        if (request.CurrentStock.HasValue && request.CurrentStock < 0)
            throw new AppValidationException("INVALID_STOCK");

        if (request.MinimumStock.HasValue && request.MinimumStock < 0)
            throw new AppValidationException("INVALID_MIN_STOCK");

        variant.Weight = request.Weight ?? variant.Weight;
        variant.Color = request.Color ?? variant.Color;
        variant.Size = request.Size ?? variant.Size;
        variant.SalePrice = request.SalePrice ?? variant.SalePrice;
        variant.PurchasePrice = request.PurchasePrice ?? variant.PurchasePrice;
        variant.CurrentStock = request.CurrentStock ?? variant.CurrentStock;
        variant.MinimumStock = request.MinimumStock ?? variant.MinimumStock;
        variant.ImageUrl = request.ImageUrl ?? variant.ImageUrl;

        _variantRepository.Update(variant);
        await _unitOfWork.SaveChangesAsync();

        return ProductVariantDto.Create(variant);
    }

    public async Task DeleteVariantAsync(int id)
    {
        var variant = await _variantRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("VARIANT_NOT_FOUND");

        _variantRepository.Delete(variant);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<PagedResult<ProductVariantDto>> GetVariantsPagedByBrandAsync(int page, int pageSize)
    {
        var allVariants = await _variantRepository.GetAllWithProductAsync();
        
        var totalCount = allVariants.Count;
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var paged = allVariants
            .OrderBy(v => v.Product!.Brand?.Name ?? "")
            .ThenBy(v => v.Product!.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return new PagedResult<ProductVariantDto>
        {
            Data = ProductVariantDto.CreateList(paged),
            Page = page,
            TotalPages = totalPages,
            TotalCount = totalCount
        };
    }
}