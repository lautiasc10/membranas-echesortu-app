using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record UpdateProductVariantRequest
(
    [StringLength(50, ErrorMessage = "El peso no puede superar los 50 caracteres")]
    string? Weight,

    [StringLength(50, ErrorMessage = "El color no puede superar los 50 caracteres")]
    string? Color,

    [StringLength(100, ErrorMessage = "El tamaño no puede superar los 100 caracteres")]
    string? Size,

    decimal? SalePrice,
    decimal? PurchasePrice,

    int? CurrentStock,
    int? MinimumStock,

    string? ImageUrl
);