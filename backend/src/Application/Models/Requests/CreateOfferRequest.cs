using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public class CreateOfferRequest
{
    [Required(ErrorMessage = "El título es requerido")]
    [StringLength(100)]
    public string? Title { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    public OfferType Type { get; set; }
    public int? ProductId { get; set; }
    public int? ProductVariantId { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal? PromoPrice { get; set; }
    public string? CustomImageUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool? IsActive { get; set; }
}