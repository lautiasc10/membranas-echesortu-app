using Domain.Entities;
using Domain.Enums;

namespace Application.Models;

public record OfferDto(
    int Id,
    string Title,
    string Description,
    OfferType Type,
    int? ProductId,
    ProductDto? Product,
    int? ProductVariantId,
    ProductVariantDto? ProductVariant,
    decimal? DiscountPercentage,
    decimal? PromoPrice,
    string? CustomImageUrl,
    DateTime StartDate,
    DateTime EndDate,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt)
{
    public static OfferDto Create(Offer offer)
    {
        return new OfferDto(
            offer.Id,
            offer.Title,
            offer.Description,
            offer.Type,
            offer.ProductId,
            offer.Product != null ? ProductDto.Create(offer.Product) : null,
            offer.ProductVariantId,
            offer.ProductVariant != null ? ProductVariantDto.Create(offer.ProductVariant) : null,
            offer.DiscountPercentage,
            offer.PromoPrice,
            offer.CustomImageUrl,
            offer.StartDate,
            offer.EndDate,
            offer.IsActive,
            offer.CreatedAt,
            offer.UpdatedAt);
    }

    public static List<OfferDto> CreateList(IEnumerable<Offer> offers)
    {
        return offers.Select(o => Create(o)).ToList();
    }
}
