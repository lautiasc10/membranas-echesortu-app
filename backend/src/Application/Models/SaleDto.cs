using Domain.Entities;

namespace Application.Models;

public record SaleDto(
    int Id,
    DateTime Date,
    int? ClientId,
    decimal Total,
    List<SaleDetailDto> Details
)
{
    public static SaleDto Create(Sale entity)
    {
        return new SaleDto(
            entity.Id,
            entity.Date,
            entity.ClientId,
            entity.Total,
            SaleDetailDto.CreateList(entity.SaleDetails)
        );
    }

    public static List<SaleDto> CreateList(IEnumerable<Sale> sales)
    {
        return sales.Select(s => Create(s)).ToList();
    }
}