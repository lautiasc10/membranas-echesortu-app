using Domain.Entities;

namespace Application.Models;

public record ProductDto(
    int Id,
    string Name,
    string? Description,
    int CategoryId,
    string? CategoryName,
    int BrandId,
    string? BrandName,
    string? ImageUrl
)
{
    public static ProductDto Create(Product entity)
    {
        return new ProductDto(
            entity.Id,
            entity.Name,
            entity.Description,
            entity.CategoryId,
            entity.Category?.Name,
            entity.BrandId,
            entity.Brand?.Name,
            entity.ImageUrl
        );
    }

    public static List<ProductDto> CreateList(IEnumerable<Product> products)
    {
        return products.Select(product => Create(product)).ToList();
    }
}