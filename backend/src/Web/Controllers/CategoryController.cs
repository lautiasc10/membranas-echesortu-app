using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[Route("api/categories")]
[ApiController]
[Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("PublicLimiter")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetAll()
    {
        return Ok(await _categoryService.GetAllCategoriesAsync());
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<CategoryDto>>> GetPagedCategories(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? sort = null)
    {
        return Ok(await _categoryService.GetPagedCategoriesAsync(page, pageSize, search, sort));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById([FromRoute] int id)
    {
        return Ok(await _categoryService.GetCategoryByIdAsync(id));
    }

    [HttpPost]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryRequest request)
    {
        var category = await _categoryService.CreateCategoryAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        await _categoryService.DeleteCategoryAsync(id);
        return NoContent();
    }
}
