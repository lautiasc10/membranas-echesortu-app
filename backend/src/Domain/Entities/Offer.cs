using Domain.Enums;

namespace Domain.Entities;

public class Offer
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public OfferType Type { get; set; }
    
    // Datos si es promocion basada en un producto existente (ProductBased)
    public int? ProductId { get; set; }
    public Product? Product { get; set; }

    public int? ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }
    
    public decimal? DiscountPercentage { get; set; } // Ejemplo: 15.0 para 15%
    public decimal? PromoPrice { get; set; } // Precio fijo alternativo
    
    // Datos si es promocion libre
    public string? CustomImageUrl { get; set; }
    
    // Vigencia
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
