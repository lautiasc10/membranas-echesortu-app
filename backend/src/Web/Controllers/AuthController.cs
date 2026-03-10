using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IClientService _clientService;
    private readonly IJwtService _jwtService;

    public AuthController(IClientService clientService, IJwtService jwtService)
    {
        _clientService = clientService;
        // IJwtService se inyecta por DI — ASP.NET lo resuelve porque
        // en Program.cs registramos: AddScoped<IJwtService, JwtService>()
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ClientDto>> Login([FromBody] LoginRequest dto)
    {
        // 1. Validar credenciales (si falla, tira UnauthorizedException → 401)
        var user = await _clientService.LoginAsync(dto.Email, dto.Password);

        // 2. Generar el JWT real con los datos del usuario
        var token = _jwtService.GenerateToken(user);
        
        // 3. Generar un Refresh Token y guardarlo con validez de 7 días
        var refreshToken = _jwtService.GenerateRefreshToken();
        await _clientService.UpdateRefreshTokenAsync(user.Id, refreshToken, DateTime.UtcNow.AddDays(7));

        // 4. Devolver acceso completo
        var response = new LoginDto(token, refreshToken, user.Name, user.Email ?? "", user.Role);

        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<LoginDto>> RefreshToken([FromBody] RefreshAuthRequest dto)
    {
        // 1. Validar el refresh token (tira 401 si no existe o expiró)
        var user = await _clientService.ValidateRefreshTokenAsync(dto.RefreshToken);

        // 2. Generar nuevas credenciales (Rotation)
        var newToken = _jwtService.GenerateToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();
        
        await _clientService.UpdateRefreshTokenAsync(user.Id, newRefreshToken, DateTime.UtcNow.AddDays(7));

        var response = new LoginDto(newToken, newRefreshToken, user.Name, user.Email ?? "", user.Role);
        return Ok(response);
    }

    [HttpPost("register-client")]
    public async Task<ActionResult<ClientDto>> RegisterClient([FromBody] RegisterRequest clientDto)
    {
        var newClient = await _clientService.RegisterClientAsync(clientDto);

        return CreatedAtAction(
            nameof(ClientController.GetClientById),
            "Client",
            new { id = newClient.Id },
            newClient
        );
    }
}