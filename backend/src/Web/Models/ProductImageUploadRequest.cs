using Microsoft.AspNetCore.Http;

namespace Web.Models;

public class ProductImageUploadRequest
{
    public IFormFile Image { get; set; } = null!;
}