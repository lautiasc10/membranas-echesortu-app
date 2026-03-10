using Microsoft.AspNetCore.Http;
using Application.Models;

namespace Web.Services;

public interface IProductImageService
{
    Task<ProductDto> UploadOrReplaceAsync(int productId, IFormFile image, HttpRequest request);
}