using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IProductVariantRepository _variantRepository;
    private readonly IBrandRepository _brandRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly ISaleDetailRepository _saleDetailRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(
        IProductRepository productRepository,
        IProductVariantRepository variantRepository,
        IBrandRepository brandRepository,
        ICategoryRepository categoryRepository,
        ISaleDetailRepository saleDetailRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _variantRepository = variantRepository;
        _brandRepository = brandRepository;
        _categoryRepository = categoryRepository;
        _saleDetailRepository = saleDetailRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<ProductDto>> GetAllProductsAsync()
    {
        var products = await _productRepository.GetProductsForListAsync();
        if (!products.Any())
            return new List<ProductDto>();

        return ProductDto.CreateList(products);
    }

    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("PRODUCT_NOT_FOUND");
        return ProductDto.Create(product);
    }

    public async Task<ProductDto> CreateProductAsync(ProductRequest request)
    {
        var product = new Product(
            request.Name,
            request.Description,
            request.CategoryId,
            request.BrandId,
            request.ImageUrl
        );
        _productRepository.Add(product);
        
        if (request.Variants != null && request.Variants.Any())
        {
            foreach (var vReq in request.Variants)
            {
                var variant = new ProductVariant(
                    product.Id, 
                    vReq.Weight,
                    vReq.Color,
                    vReq.Size,
                    vReq.SalePrice,
                    vReq.PurchasePrice,
                    vReq.CurrentStock ?? 0,
                    vReq.MinimumStock ?? 0,
                    null
                );
                
                product.ProductVariants.Add(variant);
                _variantRepository.Add(variant);
            }
        }

        await _unitOfWork.SaveChangesAsync();
        
        return ProductDto.Create(product);
    }

    public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("PRODUCT_NOT_FOUND");

        if (request.CategoryId.HasValue &&
            !await _categoryRepository.ExistsAsync(request.CategoryId.Value))
        {
            throw new NotFoundException("CATEGORY_NOT_FOUND");
        }
        if (request.BrandId.HasValue &&
            !await _brandRepository.ExistsAsync(request.BrandId.Value))
        {
            throw new NotFoundException("BRAND_NOT_FOUND");
        }

        product.Name = request.Name ?? product.Name;
        product.Description = request.Description ?? product.Description;
        product.CategoryId = request.CategoryId ?? product.CategoryId;
        product.BrandId = request.BrandId ?? product.BrandId;
        product.ImageUrl = request.ImageUrl ?? product.ImageUrl;

        _productRepository.Update(product);
        await _unitOfWork.SaveChangesAsync();
        return ProductDto.Create(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("PRODUCT_NOT_FOUND");

        _productRepository.Delete(product);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<ProductDto>> GetTopSellingProductsAsync(int count = 6)
    {
        var topProductIds = await _saleDetailRepository.GetTopSellingProductIdsAsync(count);

        if (topProductIds.Any())
        {
            var products = await _productRepository.GetByIdsAsync(topProductIds);

            // Maintain the sales-order ranking
            var ordered = topProductIds
                .Select(id => products.First(p => p.Id == id))
                .ToList();

            return ProductDto.CreateList(ordered);
        }

        var allProducts = await _productRepository.GetProductsForListAsync();
        return ProductDto.CreateList(allProducts.Take(count));
    }

    public async Task<PagedResult<ProductWithVariantsDto>> GetPagedProductsAsync(int page, int pageSize, string? search, string? brand, string? category, string? sort)
    {
        var (products, totalCount) = await _productRepository.GetPagedProductsAsync(page, pageSize, search, brand, category, sort);

        return new PagedResult<ProductWithVariantsDto>
        {
            Data = products.Select(ProductWithVariantsDto.Create).ToList(),
            TotalCount = totalCount,
            Page = page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }
}
