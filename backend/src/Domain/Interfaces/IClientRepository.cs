using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IClientRepository : IRepository<Client>
    {
        Task<Client?> GetByEmailAsync(string email);
        Task<Client?> GetByPhoneNumberAsync(string phoneNumber);
        Task<Client?> GetByNameAsync(string name);
        Task<Client?> GetByRefreshTokenAsync(string refreshToken);
        Task<(List<Client> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search, string? sort);
    }
}