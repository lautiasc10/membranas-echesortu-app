using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Models;
using Web.Services;

[Route("api/products")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IProductImageService _productImageService;

    public ProductController(IProductService productService, IProductImageService productImageService)
    {
        _productService = productService;
        _productImageService = productImageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
    {
        return Ok(await _productService.GetAllProductsAsync());
    }

    [HttpGet("top-selling")]
    public async Task<ActionResult<List<ProductDto>>> GetTopSellingProducts([FromQuery] int count = 6)
    {
        return Ok(await _productService.GetTopSellingProductsAsync(count));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProductById([FromRoute] int id)
    {
        return Ok(await _productService.GetProductByIdAsync(id));
    }

    [HttpPost]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<ActionResult<ProductDto>> Create([FromBody] ProductRequest request)
    {
        var created = await _productService.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetProductById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<ActionResult<ProductDto>> Update([FromRoute] int id, [FromBody] UpdateProductRequest request)
    {
        return Ok(await _productService.UpdateProductAsync(id, request));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> DeleteProduct([FromRoute] int id)
    {
        await _productService.DeleteProductAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/image")]
    [Authorize(Roles = "admin,superadmin")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ProductDto>> UploadProductImage(
        [FromRoute] int id,
        [FromForm] ProductImageUploadRequest form)
    {
        var updated = await _productImageService.UploadOrReplaceAsync(id, form.Image, Request);
        return Ok(updated);
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<ProductWithVariantsDto>>> GetPagedProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 8,
        [FromQuery] string? search = null,
        [FromQuery] string? brand = null,
        [FromQuery] string? category = null,
        [FromQuery] string? sort = null)
    {
        var result = await _productService.GetPagedProductsAsync(page, pageSize, search, brand, category, sort);
        return Ok(result);
    }
}