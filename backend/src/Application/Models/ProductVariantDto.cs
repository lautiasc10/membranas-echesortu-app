using Domain.Entities;

namespace Application.Models;

public record ProductVariantDto(
    int Id,
    int ProductId,
    string ProductName,
    string BrandName,
    string CategoryName,
    string? Weight,
    string? Color,
    string? Size,
    decimal SalePrice,
    decimal PurchasePrice,
    int? CurrentStock,
    int? MinimumStock,
    string? ImageUrl
)
{
    public static ProductVariantDto Create(ProductVariant entity)
    {
        return new ProductVariantDto(
            entity.Id,
            entity.ProductId,
            entity.Product?.Name ?? "",
            entity.Product?.Brand?.Name ?? "",
            entity.Product?.Category?.Name ?? "",
            entity.Weight,
            entity.Color,
            entity.Size,
            entity.SalePrice,
            entity.PurchasePrice,
            entity.CurrentStock,
            entity.MinimumStock,
            entity.Product?.ImageUrl
        );
    }

    public static List<ProductVariantDto> CreateList(IEnumerable<ProductVariant> variants)
    {
        return variants.Select(v => Create(v)).ToList();
    }
}