namespace Application.Models.Requests;
public record SaleDetailRequest(
    int ProductVariantId,
    int Quantity
);