using Application.Interfaces;

namespace Infrastructure.Services;
public class PasswordHasherService : IPasswordHasher
{
    // Genera un hash seguro a partir de una contraseña en texto plano.
    public string HashPassword(string password) => BCrypt.Net.BCrypt.HashPassword(password);

    // Verifica si una contraseña ingresada coincide con su hash almacenado.
    public bool VerifyPassword(string password, string hashedPassword) => BCrypt.Net.BCrypt.Verify(password, hashedPassword);
}