using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IImageStorageService
{
    Task<string> SaveProductImageAsync(IFormFile file, HttpRequest request);
    void DeleteIfExists(string? imageUrlOrPath);
}