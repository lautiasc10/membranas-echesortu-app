using Microsoft.AspNetCore.Http;

namespace Web.Models;

public class GalleryImageUploadRequest
{
    public IFormFile Image { get; set; } = null!;
}
