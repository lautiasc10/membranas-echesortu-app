namespace Domain.Entities
{
    public class Client
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        // Para mostrador pueden ser null
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        // Solo para registrados
        public string? Password { get; set; }

        // 🔑 Distingue cliente registrado vs cliente local
        public bool IsGuest { get; set; } = false;

        // 🛡️ Rol del usuario: "admin" o "client"
        // Por defecto todos son "client". Solo se cambia manualmente en la DB.
        public string Role { get; set; } = "client";

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        // 🔄 Refresh Token for long sessions
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public List<Sale> Sales { get; set; } = new();

        public Client() { }

        // Registrado
        public static Client CreateRegistered(string name, string phoneNumber, string email, string hashedPassword)
        {
            return new Client
            {
                Name = name,
                PhoneNumber = phoneNumber,
                Email = email,
                Password = hashedPassword,
                IsGuest = false,
                Role = "client"
            };
        }

        // Mostrador (admin / local)
        public static Client CreateGuest(string name, string? email = null)
        {
            return new Client
            {
                Name = name,
                Email = email,
                IsGuest = true,
                Password = null,
                PhoneNumber = null,
                Role = "guest"
            };
        }

        public void SetPassword(string hashedPassword)
        {
            Password = hashedPassword;
        }
    }
}