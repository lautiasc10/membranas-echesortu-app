using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record UpdateClientRequest(
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres")]
    string? Name,

    [RegularExpression(@"^\+?[0-9\s\-]{7,15}$", ErrorMessage = "Ingrese un número de teléfono válido")]
    string? PhoneNumber,

    [EmailAddress(ErrorMessage = "Ingrese un email válido")]
    string? Email,

    [RegularExpression(@"^(superadmin|admin|client|guest)$", ErrorMessage = "Rol inválido")]
    string? Role
);