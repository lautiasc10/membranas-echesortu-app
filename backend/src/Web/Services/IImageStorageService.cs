using Microsoft.AspNetCore.Http;

namespace Web.Services;

public interface IImageStorageService
{
    Task<string> SaveProductImageAsync(IFormFile file, HttpRequest request);
    void DeleteIfExists(string? imageUrlOrPath);
}