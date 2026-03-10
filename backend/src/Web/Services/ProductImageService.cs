using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;

namespace Web.Services;

public class ProductImageService : IProductImageService
{
    private readonly IProductService _productService;
    private readonly IImageStorageService _imageStorage;

    public ProductImageService(IProductService productService, IImageStorageService imageStorage)
    {
        _productService = productService;
        _imageStorage = imageStorage;
    }

    public async Task<ProductDto> UploadOrReplaceAsync(int productId, IFormFile image, HttpRequest request)
{
    if (image == null || image.Length == 0)
        throw new ArgumentException("Imagen requerida.");

    var product = await _productService.GetProductByIdAsync(productId);

    string? newUrl = null;

    try
    {
        newUrl = await _imageStorage.SaveProductImageAsync(image, request);

        var req = new UpdateProductRequest(
            Name: null,
            Description: null,
            CategoryId: null,
            BrandId: null,
            ImageUrl: newUrl
        );

        var updated = await _productService.UpdateProductAsync(productId, req);

        // si salió bien, borramos la anterior
        _imageStorage.DeleteIfExists(product.ImageUrl);

        return updated;
    }
    catch
    {
        // si algo falló, limpiamos la nueva
        if (!string.IsNullOrWhiteSpace(newUrl))
            _imageStorage.DeleteIfExists(newUrl);

        throw;
    }
}
}