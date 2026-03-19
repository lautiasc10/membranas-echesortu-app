using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class ClientService : IClientService
{
    private readonly IClientRepository _clientRepository;
    private readonly IPasswordHasher _hasher;
    private readonly IUnitOfWork _unitOfWork;

    public ClientService(IClientRepository clientRepository, IPasswordHasher hasher, IUnitOfWork unitOfWork)
    {
        _clientRepository = clientRepository;
        _hasher = hasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<ClientDto>> GetAllClientsAsync()
    {
        var clients = await _clientRepository.ListAsync();
        if (!clients.Any())
            return new List<ClientDto>();

        return ClientDto.CreateList(clients);
    }

    public async Task<ClientDto> GetClientByIdAsync(int id)
    {
        var client = await _clientRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("CLIENT_NOT_FOUND");

        return ClientDto.Create(client);
    }

    public async Task<ClientDto> RegisterClientAsync(RegisterRequest request)
    {
        if (await _clientRepository.GetByEmailAsync(request.Email) != null)
            throw new AppValidationException("EMAIL_ALREADY_EXISTS");

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber) && 
            await _clientRepository.GetByPhoneNumberAsync(request.PhoneNumber) != null)
            throw new AppValidationException("PHONE_NUMBER_ALREADY_EXISTS");

        var hashed = _hasher.HashPassword(request.Password);
        var client = Client.CreateRegistered(request.Name, request.PhoneNumber, request.Email, hashed);

        _clientRepository.Add(client);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _clientRepository.GetByIdAsync(client.Id);
        return ClientDto.Create(saved!);
    }

    public async Task<Client> LoginAsync(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            throw new AppValidationException("EMAIL_AND_PASSWORD_REQUIRED");

        var client = await _clientRepository.GetByEmailAsync(email);

        if (client == null || client.IsGuest)
            throw new UnauthorizedException("INVALID_EMAIL_OR_PASSWORD");

        if (string.IsNullOrWhiteSpace(client.Password) || !_hasher.VerifyPassword(password, client.Password))
            throw new UnauthorizedException("INVALID_EMAIL_OR_PASSWORD");

        return client;
    }

    public async Task<ClientDto> CreateGuestClientAsync(CreateGuestClientRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var exists = await _clientRepository.GetByEmailAsync(request.Email);
            if (exists != null)
                throw new AppValidationException("EMAIL_ALREADY_EXISTS");
        }

        var client = Client.CreateGuest(request.Name, request.Email);

        _clientRepository.Add(client);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _clientRepository.GetByIdAsync(client.Id);
        return ClientDto.Create(saved!);
    }

    public async Task<ClientDto> UpdateClientAsync(int id, UpdateClientRequest request)
    {
        var client = await _clientRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("CLIENT_NOT_FOUND");

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var existing = await _clientRepository.GetByEmailAsync(request.Email);
            if (existing != null && existing.Id != id)
                throw new AppValidationException("EMAIL_ALREADY_EXISTS");
        }

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            var existing = await _clientRepository.GetByPhoneNumberAsync(request.PhoneNumber);
            if (existing != null && existing.Id != id)
                throw new AppValidationException("PHONE_NUMBER_ALREADY_EXISTS");
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
            client.Name = request.Name;

        if (request.PhoneNumber is not null)
            client.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber;

        if (request.Email is not null)
            client.Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email;

        if (!string.IsNullOrWhiteSpace(request.Role))
            client.Role = request.Role;

        _clientRepository.Update(client);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _clientRepository.GetByIdAsync(id);
        return ClientDto.Create(saved!);
    }

    public async Task DeleteClientAsync(int id)
    {
        var client = await _clientRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("CLIENT_NOT_FOUND");

        _clientRepository.Delete(client);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<Client> ValidateRefreshTokenAsync(string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            throw new UnauthorizedException("INVALID_REFRESH_TOKEN");

        var client = await _clientRepository.GetByRefreshTokenAsync(refreshToken);

        if (client == null || client.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new UnauthorizedException("INVALID_OR_EXPIRED_REFRESH_TOKEN");

        return client;
    }

    public async Task UpdateRefreshTokenAsync(int clientId, string refreshToken, DateTime expiryTime)
    {
        var client = await _clientRepository.GetByIdAsync(clientId)
            ?? throw new NotFoundException("CLIENT_NOT_FOUND");

        client.RefreshToken = refreshToken;
        client.RefreshToken = refreshToken;
        client.RefreshTokenExpiryTime = expiryTime;

        _clientRepository.Update(client);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<PagedResult<ClientDto>> GetPagedClientsAsync(int page, int pageSize, string? search, string? sort)
    {
        var (clients, totalCount) = await _clientRepository.GetPagedAsync(page, pageSize, search, sort);

        return new PagedResult<ClientDto>
        {
            Data = ClientDto.CreateList(clients),
            TotalCount = totalCount,
            Page = page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }
}