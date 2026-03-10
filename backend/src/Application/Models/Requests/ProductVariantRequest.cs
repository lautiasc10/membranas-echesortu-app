using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record ProductVariantRequest
(
    [Required]
    int ProductId,

    [StringLength(50, ErrorMessage = "El peso no puede superar los 50 caracteres")]
    string? Weight,

    [StringLength(50, ErrorMessage = "El color no puede superar los 50 caracteres")]
    string? Color,

    [StringLength(100, ErrorMessage = "El tamaño no puede superar los 100 caracteres")]
    string? Size,

    [Required(ErrorMessage = "El precio de venta es requerido")]
    decimal SalePrice,

    [Required(ErrorMessage = "El precio de compra es requerido")]
    decimal PurchasePrice,

    int? CurrentStock,
    int? MinimumStock,

    string? ImageUrl
);