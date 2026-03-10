using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record ProductRequest
(
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(150, MinimumLength = 2,
        ErrorMessage = "El nombre debe tener entre 2 y 150 caracteres")]
    string Name,

    [StringLength(500,
        ErrorMessage = "La descripción no puede superar los 500 caracteres")]
    string? Description,

    [Required(ErrorMessage = "La categoría es requerida")]
    int CategoryId,

    [Required(ErrorMessage = "La marca es requerida")]
    int BrandId,
    
    string? ImageUrl,

    // Lista de variantes a crear junto con el producto
    List<ProductVariantInCreateRequest>? Variants = null
);

public record ProductVariantInCreateRequest
(
    decimal SalePrice,
    decimal PurchasePrice,
    int? CurrentStock,
    int? MinimumStock,
    string? Weight,
    string? Color,
    string? Size
);