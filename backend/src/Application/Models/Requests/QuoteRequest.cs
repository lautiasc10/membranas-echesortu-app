namespace Application.Models.Requests;

public record QuoteRequest(
    string ClientName,
    string ClientAddress,
    string ClientCity,
    string WorkLocation,
    List<QuoteDetailRequest> Details
);
