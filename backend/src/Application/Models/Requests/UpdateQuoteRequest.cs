namespace Application.Models.Requests;

public record UpdateQuoteRequest(
    int Id,
    string ClientName,
    string ClientAddress,
    string ClientCity,
    string WorkLocation,
    List<QuoteDetailRequest> Details
);
