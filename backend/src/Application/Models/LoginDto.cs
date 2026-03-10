namespace Application.Models
{
    public record LoginDto(string Token, string RefreshToken, string Name, string Email, string Role)
    {
        public static LoginDto Create(string token, string refreshToken, string name, string email, string role)
        {
            return new LoginDto(token, refreshToken, name, email, role);
        }
    }

}