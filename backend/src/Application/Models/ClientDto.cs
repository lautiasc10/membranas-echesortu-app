using Domain.Entities;

namespace Application.Models;

public record ClientDto(
    int Id,
    string Name,
    string? PhoneNumber,
    string? Email,
    bool IsGuest,
    string Role,
    DateTime RegistrationDate
)
{
    public static ClientDto Create(Client entity)
        => new(entity.Id, entity.Name, entity.PhoneNumber, entity.Email, entity.IsGuest, entity.Role, entity.RegistrationDate);

    public static List<ClientDto> CreateList(IEnumerable<Client> clients)
        => clients.Select(Create).ToList();
}