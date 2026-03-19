using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;

[Route("api/clients")]
[ApiController]
[Authorize(Roles = "admin,superadmin")]  // Solo el admin puede gestionar clientes
[Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("PublicLimiter")]
public class ClientController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientController(IClientService clientService)
    {
        _clientService = clientService;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientDto>>> GetAllClients()
    {
        return Ok(await _clientService.GetAllClientsAsync());
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<ClientDto>>> GetPagedClients(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? sort = null)
    {
        return Ok(await _clientService.GetPagedClientsAsync(page, pageSize, search, sort));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientDto>> GetClientById([FromRoute] int id)
    {
        return Ok(await _clientService.GetClientByIdAsync(id));
    }

    [HttpPost("guest")]
    public async Task<ActionResult<ClientDto>> CreateGuest([FromBody] CreateGuestClientRequest request)
    {
        var created = await _clientService.CreateGuestClientAsync(request);
        return Ok(created);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<ClientDto>> UpdateClient([FromRoute] int id, [FromBody] UpdateClientRequest request)
    {
        var updated = await _clientService.UpdateClientAsync(id, request);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteClient([FromRoute] int id)
    {
        await _clientService.DeleteClientAsync(id);
        return NoContent();
    }
}