namespace Application.Models.Requests;

public record QuoteDetailRequest(
    int? Id,
    string ProductName,
    int Quantity,
    decimal UnitPrice
);
