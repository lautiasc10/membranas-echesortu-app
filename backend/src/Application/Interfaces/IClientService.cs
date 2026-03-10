using Application.Models;
using Application.Models.Requests;
using Domain.Entities;

namespace Application.Interfaces;

public interface IClientService
{
    Task<List<ClientDto>> GetAllClientsAsync();
    Task<ClientDto> GetClientByIdAsync(int id);
    Task<Client> LoginAsync(string email, string password);
    Task<ClientDto> RegisterClientAsync(RegisterRequest request);
    Task<ClientDto> CreateGuestClientAsync(CreateGuestClientRequest request);
    Task<ClientDto> UpdateClientAsync(int id, UpdateClientRequest request);
    Task DeleteClientAsync(int id);
    Task<Client> ValidateRefreshTokenAsync(string refreshToken);
    Task UpdateRefreshTokenAsync(int clientId, string refreshToken, DateTime expiryTime);
    Task<PagedResult<ClientDto>> GetPagedClientsAsync(int page, int pageSize, string? search, string? sort);
}