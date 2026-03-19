using Microsoft.AspNetCore.Http;

namespace Web.Models;

public class OfferImageUploadRequest
{
    public IFormFile Image { get; set; } = null!;
}
