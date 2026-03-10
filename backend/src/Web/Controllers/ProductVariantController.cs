using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[ApiController]
[Route("api/product-variants")]
public class ProductVariantController : ControllerBase
{
    private readonly IProductVariantService _variantService;

    public ProductVariantController(IProductVariantService variantService)
    {
        _variantService = variantService;
    }

    [HttpGet("paged-by-brand")]
    public async Task<ActionResult<PagedResult<ProductVariantDto>>> GetPagedByBrand(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        return Ok(await _variantService.GetVariantsPagedByBrandAsync(page, pageSize));
    }

    [HttpGet("all")]
    public async Task<ActionResult<List<ProductVariantDto>>> GetAll()
    {
        return Ok(await _variantService.GetAllVariantsAsync());
    }

    [HttpGet("by-product/{productId}")]
    public async Task<ActionResult<List<ProductVariantDto>>> GetByProduct([FromRoute] int productId)
    {
        return Ok(await _variantService.GetVariantsByProductAsync(productId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductVariantDto>> GetById([FromRoute] int id)
    {
        return Ok(await _variantService.GetVariantByIdAsync(id));
    }

    [HttpPost]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<ActionResult<ProductVariantDto>> Create([FromBody] ProductVariantRequest request)
    {
        var created = await _variantService.CreateVariantAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<ActionResult<ProductVariantDto>> Update(
        [FromRoute] int id,
        [FromBody] UpdateProductVariantRequest request)
    {
        return Ok(await _variantService.UpdateVariantAsync(id, request));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await _variantService.DeleteVariantAsync(id);
        return NoContent();
    }
}