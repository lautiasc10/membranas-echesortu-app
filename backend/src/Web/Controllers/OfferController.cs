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
public class OfferController : ControllerBase
{
    private readonly IOfferService _offerService;
    private readonly IImageStorageService _imageService;

    public OfferController(IOfferService offerService, IImageStorageService imageService)
    {
        _offerService = offerService;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool onlyActive = false)
    {
        var result = await _offerService.GetPagedAsync(page, pageSize, onlyActive);
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveOffers()
    {
        var offers = await _offerService.GetActiveOffersAsync();
        return Ok(offers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var offer = await _offerService.GetByIdAsync(id);
        return Ok(offer);
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOfferRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var offer = await _offerService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = offer.Id }, offer);
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<OfferDto>> Update([FromRoute] int id, [FromBody] UpdateOfferRequest request)
    {  
        return Ok(await _offerService.UpdateAsync(id, request));
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpPost("{id}/image")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(int id, [FromForm] OfferImageUploadRequest form)
    {
        var offerDto = await _offerService.GetByIdAsync(id);
        var imageUrl = await _imageService.SaveProductImageAsync(form.Image, Request);

        var updateRequest = new UpdateOfferRequest
        {
            Title = offerDto.Title,
            Description = offerDto.Description,
            DiscountPercentage = offerDto.DiscountPercentage,
            PromoPrice = offerDto.PromoPrice,
            CustomImageUrl = imageUrl,
            StartDate = offerDto.StartDate,
            EndDate = offerDto.EndDate,
            IsActive = offerDto.IsActive
        };

        var updated = await _offerService.UpdateAsync(id, updateRequest);

        if (!string.IsNullOrEmpty(offerDto.CustomImageUrl))
            _imageService.DeleteIfExists(offerDto.CustomImageUrl);

        return Ok(updated);
    }

    [Authorize(Roles = "admin,superadmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _offerService.DeleteAsync(id);
        return NoContent();
    }
}