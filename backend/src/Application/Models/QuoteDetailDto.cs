using Domain.Entities;

namespace Application.Models;

public record QuoteDetailDto(
    int Id,
    int QuoteId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal
)
{
    public static QuoteDetailDto Create(QuoteDetail entity)
    {
        return new QuoteDetailDto(
            entity.Id,
            entity.QuoteId,
            entity.ProductName,
            entity.Quantity,
            entity.UnitPrice,
            entity.Subtotal
        );
    }

    public static List<QuoteDetailDto> CreateList(IEnumerable<QuoteDetail> details)
    {
        return details.Select(d => Create(d)).ToList();
    }
}
