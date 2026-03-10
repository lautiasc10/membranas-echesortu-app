using Domain.Entities;

namespace Application.Models;

public record QuoteDto(
    int Id,
    DateTime Date,
    string ClientName,
    string ClientAddress,
    string ClientCity,
    string WorkLocation,
    decimal Total,
    List<QuoteDetailDto> Details
)
{
    public static QuoteDto Create(Quote entity)
    {
        return new QuoteDto(
            entity.Id,
            entity.Date,
            entity.ClientName,
            entity.ClientAddress,
            entity.ClientCity,
            entity.WorkLocation,
            entity.Total,
            QuoteDetailDto.CreateList(entity.QuoteDetails)
        );
    }

    public static List<QuoteDto> CreateList(IEnumerable<Quote> quotes)
    {
        return quotes.Select(q => Create(q)).ToList();
    }
}
