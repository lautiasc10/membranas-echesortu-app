using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record CreateGuestClientRequest(
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres")]
    string Name,

    [EmailAddress(ErrorMessage = "Ingrese un email válido")]
    string? Email
);