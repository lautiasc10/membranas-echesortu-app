using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

    public record RegisterRequest
    (
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres")]
        string Name,

        [Required(ErrorMessage = "El teléfono es requerido")]
        [RegularExpression(@"^\+?[0-9\s\-]{7,15}$", ErrorMessage = "Ingrese un número de teléfono válido")]
        string PhoneNumber,

        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "Ingrese un email válido")]
        string Email,

        [Required(ErrorMessage = "La contraseña es requerida")]
        [RegularExpression(@"^(?=.*[A-Z]).{8,}$", ErrorMessage = "La contraseña debe tener al menos 8 caracteres y una letra mayúscula")]
        string Password
    );