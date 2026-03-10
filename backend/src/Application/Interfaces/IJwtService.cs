using Domain.Entities;

namespace Application.Interfaces;

/// <summary>
/// Define la capacidad de generar tokens JWT.
/// Vive en Application (no en Infrastructure) porque la capa de negocio
/// necesita SABER que existe esta operación, aunque no le importa CÓMO se implementa.
/// </summary>
public interface IJwtService
{
    /// <summary>
    /// Genera un token JWT firmado para el cliente dado.
    /// El token contendrá claims como Id, Email, Name, etc.
    string GenerateToken(Client client);

    /// <summary>
    /// Genera un token aleatorio criptográficamente seguro para usar como Refresh Token
    /// </summary>
    string GenerateRefreshToken();
}
