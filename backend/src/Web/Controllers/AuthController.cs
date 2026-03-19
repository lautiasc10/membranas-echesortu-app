using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Route("api/auth")]
[ApiController]
[EnableRateLimiting("AuthLimiter")]
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

        // 4. Configurar opciones de Cookie Segura
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Recordar usar HTTPS en producción
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(480) // Expiración del JWT
        };

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7) // Expiración del RefreshToken
        };

        // 5. Inyectar tokens en Cookies
        Response.Cookies.Append("auth_token", token, cookieOptions);
        Response.Cookies.Append("refresh_token", refreshToken, refreshCookieOptions);

        return Ok(new { user.Name, user.Email, user.Role });
    }

    [HttpPost("refresh")]
    public async Task<ActionResult> RefreshToken()
    {
        // 1. Obtener Refresh Token
        var refreshToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(refreshToken)) return Unauthorized("Token missing in cookies");

        var user = await _clientService.ValidateRefreshTokenAsync(refreshToken);

        // 2. Generar nuevas credenciales (Rotation)
        var newToken = _jwtService.GenerateToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();
        
        await _clientService.UpdateRefreshTokenAsync(user.Id, newRefreshToken, DateTime.UtcNow.AddDays(7));

        var cookieOptions = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.UtcNow.AddMinutes(480) };
        var refreshCookieOptions = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.UtcNow.AddDays(7) };

        Response.Cookies.Append("auth_token", newToken, cookieOptions);
        Response.Cookies.Append("refresh_token", newRefreshToken, refreshCookieOptions);

        return Ok(new { user.Name, user.Email, user.Role });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var cookieOptions = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.UtcNow.AddDays(-1) };
        Response.Cookies.Append("auth_token", "", cookieOptions);
        Response.Cookies.Append("refresh_token", "", cookieOptions);
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult> GetMe()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

        var user = await _clientService.GetClientByIdAsync(userId);
        if (user == null) return Unauthorized();

        return Ok(new { user.Id, user.Name, user.Email, user.Role });
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