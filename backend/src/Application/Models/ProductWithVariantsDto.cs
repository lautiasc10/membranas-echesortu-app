using Domain.Entities;

namespace Application.Models;

public record ProductWithVariantsDto(
    int ProductId,
    string Name,
    string? Description,
    int? CategoryId,
    string? Category,
    int? BrandId,
    string? Brand,
    string? ImageUrl,
    List<ProductVariantDto> Variants
)
{
    public static ProductWithVariantsDto Create(Product entity)
    {
        return new ProductWithVariantsDto(
            entity.Id,
            entity.Name,
            entity.Description,
            entity.CategoryId,
            entity.Category?.Name,
            entity.BrandId,
            entity.Brand?.Name,
            entity.ImageUrl,
            entity.ProductVariants?.Select(v => ProductVariantDto.Create(v)).ToList() ?? new List<ProductVariantDto>()
        );
    }
}
