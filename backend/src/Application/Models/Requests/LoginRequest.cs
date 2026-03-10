using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record LoginRequest(
    [Required] string Email,
    [Required] string Password
);