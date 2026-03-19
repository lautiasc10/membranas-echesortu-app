using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Models;

namespace Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("PublicLimiter")]
public class GalleryController : ControllerBase
{
    private readonly IGalleryService _galleryService;
    private readonly IImageStorageService _imageService;

    public GalleryController(IGalleryService galleryService, IImageStorageService imageService)
    {
        _galleryService = galleryService;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool onlyVisible = true)
    {
        var result = await _galleryService.GetPagedAsync(page, pageSize, onlyVisible);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _galleryService.GetByIdAsync(id);
        return Ok(project);
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGalleryProjectRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var project = await _galleryService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<GalleryProjectDto>> Update([FromRoute] int id, [FromBody] UpdateGalleryProjectRequest request)
    {
        return Ok(await _galleryService.UpdateAsync(id, request));
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpPost("{id}/before-image")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadBeforeImage(int id, [FromForm] GalleryImageUploadRequest form)
    {
        var projectDto = await _galleryService.GetByIdAsync(id);
        var imageUrl = await _imageService.SaveProductImageAsync(form.Image, Request);

        var updateRequest = new UpdateGalleryProjectRequest
        {
            Title = projectDto.Title,
            Description = projectDto.Description,
            WorkDate = projectDto.WorkDate,
            IsVisible = projectDto.IsVisible,
            OrderIndex = projectDto.OrderIndex,
            BeforeImageUrl = imageUrl,
            AfterImageUrl = projectDto.AfterImageUrl
        };

        var updated = await _galleryService.UpdateAsync(id, updateRequest);

        if (!string.IsNullOrEmpty(projectDto.BeforeImageUrl))
            _imageService.DeleteIfExists(projectDto.BeforeImageUrl);

        return Ok(updated);
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpPost("{id}/after-image")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadAfterImage(int id, [FromForm] GalleryImageUploadRequest form)
    {
        var projectDto = await _galleryService.GetByIdAsync(id);
        var imageUrl = await _imageService.SaveProductImageAsync(form.Image, Request);

        var updateRequest = new UpdateGalleryProjectRequest
        {
            Title = projectDto.Title,
            Description = projectDto.Description,
            WorkDate = projectDto.WorkDate,
            IsVisible = projectDto.IsVisible,
            OrderIndex = projectDto.OrderIndex,
            BeforeImageUrl = projectDto.BeforeImageUrl,
            AfterImageUrl = imageUrl
        };

        var updated = await _galleryService.UpdateAsync(id, updateRequest);

        if (!string.IsNullOrEmpty(projectDto.AfterImageUrl))
            _imageService.DeleteIfExists(projectDto.AfterImageUrl);

        return Ok(updated);
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _galleryService.DeleteAsync(id);
        return NoContent();
    }
}