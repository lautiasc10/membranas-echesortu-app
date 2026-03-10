using Domain.Entities;

namespace Application.Models;
public record SaleDetailDto(
    int Id,
    int ProductVariantId,
    int Quantity,
    decimal UnitPrice,
    decimal UnitCost,
    decimal Subtotal,
    decimal Profit
)
{
    public static SaleDetailDto Create(SaleDetail entity)
    {
        return new SaleDetailDto(
            entity.Id,
            entity.ProductVariantId,
            entity.Quantity,
            entity.UnitPrice,
            entity.UnitCost,
            entity.Subtotal,
            entity.Profit
        );
    }

    public static List<SaleDetailDto> CreateList(IEnumerable<SaleDetail> details)
    {
        return details.Select(d => Create(d)).ToList();
    }
}