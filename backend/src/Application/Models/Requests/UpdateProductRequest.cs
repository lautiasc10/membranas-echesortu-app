using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record UpdateProductRequest
(
   
    [StringLength(150, ErrorMessage = "El nombre no puede superar los 150 caracteres")]
    string? Name,
    
    [StringLength(150, ErrorMessage = "El nombre no puede superar los 150 caracteres")]
    string? Description,

    int? CategoryId,

    int? BrandId,
    
    string? ImageUrl
);