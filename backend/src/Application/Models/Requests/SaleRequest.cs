namespace Application.Models.Requests;

public record SaleRequest(
    int? ClientId,
    List<SaleDetailRequest> Details
);