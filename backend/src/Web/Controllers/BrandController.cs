using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[Route("api/brands")]
[ApiController]
[Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("PublicLimiter")]
public class BrandController : ControllerBase
{
    private readonly IBrandService _brandService;

    public BrandController(IBrandService brandService)
    {
        _brandService = brandService;
    }
    [HttpGet]
    public async Task<ActionResult<List<BrandDto>>> GetAll()
    {
        return Ok(await _brandService.GetAllBrandsAsync());
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<BrandDto>>> GetPagedBrands(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? sort = null)
    {
        return Ok(await _brandService.GetPagedBrandsAsync(page, pageSize, search, sort));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BrandDto>> GetById([FromRoute] int id)
    {
        return Ok(await _brandService.GetBrandByIdAsync(id));
    }

    [HttpPost]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<ActionResult<BrandDto>> Create([FromBody] CreateBrandRequest request)
    {
        var brand = await _brandService.CreateBrandAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = brand.Id }, brand);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await _brandService.DeleteBrandAsync(id);
        return NoContent();
    }
}
