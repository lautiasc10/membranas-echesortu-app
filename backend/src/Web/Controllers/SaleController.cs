using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[Route("api/sales")]
[ApiController]
[Authorize(Roles = "admin,superadmin")]  // Solo el admin puede gestionar ventas
[Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("PublicLimiter")]
public class SaleController : ControllerBase
{
    private readonly ISaleService _saleService;

    public SaleController(ISaleService saleService)
    {
        _saleService = saleService;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetAllSales()
    {
        return Ok(await _saleService.GetAllSalesAsync());
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<SaleDto>>> GetPagedSales(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? sort = null)
    {
        return Ok(await _saleService.GetPagedSalesAsync(page, pageSize, search, status, fromDate, toDate, sort));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SaleDto>> GetById([FromRoute] int id)
    {
        return Ok(await _saleService.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<ActionResult<SaleDto>> Create([FromBody] SaleRequest request)
    {
        var sale = await _saleService.CreateSaleAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = sale.Id }, sale);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SaleDto>> UpdateSale([FromRoute] int id, [FromBody] UpdateSaleRequest request)
    {
        return Ok(await _saleService.UpdateSaleAsync(id, request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSale([FromRoute] int id)
    {
        await _saleService.DeleteSaleAsync(id);
        return NoContent();
    }
}