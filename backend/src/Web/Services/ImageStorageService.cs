using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Web.Services;

public class ImageStorageService : IImageStorageService
{
    private readonly Cloudinary _cloudinary;
    private readonly IWebHostEnvironment _env;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    { ".jpg", ".jpeg", ".png", ".webp", ".gif" };

    private const long MaxBytes = 5 * 1024 * 1024; // 5MB

    public ImageStorageService(IConfiguration config, IWebHostEnvironment env)
    {
        _env = env;
        
        var cloudName = config["Cloudinary:CloudName"];
        var apiKey = config["Cloudinary:ApiKey"];
        var apiSecret = config["Cloudinary:ApiSecret"];

        // Hacemos que funcione localmente (siempre y cuando estén provistas variables).
        if (string.IsNullOrWhiteSpace(cloudName) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
        {
             // Para evitar que explote si no hay internet o si no se pasaron las llaves,
             // opcionalmente podrías hacer fallback a un default o throw
             Console.WriteLine("ADVERTENCIA: Credenciales de Cloudinary faltantes. Las subidas fallarán.");
        }

        var acc = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(acc);
        _cloudinary.Api.Secure = true;
    }

    public async Task<string> SaveProductImageAsync(IFormFile file, HttpRequest request)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Archivo vacío.");

        if (file.Length > MaxBytes)
            throw new ArgumentException("La imagen supera el tamaño máximo (5MB).");

        var ext = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(ext))
            throw new ArgumentException("Formato no permitido. Usa JPG, PNG, GIF o WEBP.");

        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            // Cloudinary auto-optimizará estas imágenes
            Folder = "membranas_ecommerce_products",
            UseFilename = true,
            UniqueFilename = true,
            Overwrite = false
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            throw new Exception($"Error al subir imagen a Cloudinary: {uploadResult.Error.Message}");
        }

        // Return The Secure URL.
        return uploadResult.SecureUrl.ToString();
    }

    public void DeleteIfExists(string? imageUrlOrPath)
    {
        if (string.IsNullOrWhiteSpace(imageUrlOrPath)) return;
        
        // Si no es URL de Cloudinary, return
        if (!imageUrlOrPath.Contains("res.cloudinary.com")) return;

        // Extraer el PublicId de Cloudinary para poder borrar la foto
        // Ejemplo URL: https://res.cloudinary.com/dt.../image/upload/v1234/folder/archivo.jpg
        try 
        {
            var uri = new Uri(imageUrlOrPath);
            var segments = uri.Segments;
            
            // Reconstruir el path después de "upload/"
            // omitiendo "v[versión]/" si existe
            var relevantPath = string.Join("", segments.SkipWhile(s => s != "upload/").Skip(1));
            
            // Quitamos el parametro de versión (ej: v17102600/)
            if (relevantPath.StartsWith("v"))
            {
                var idx = relevantPath.IndexOf('/');
                if (idx != -1)
                    relevantPath = relevantPath.Substring(idx + 1);
            }

            // Remove extension
            var publicId = Path.ChangeExtension(relevantPath, null);
            
            // Decode si viene encodada
            publicId = Uri.UnescapeDataString(publicId);

            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image
            };

            // Ejecutamos en background (Fire and forget síncrona/wrapper)
            // No podemos usar Async porque la interfaz dicta void
            _cloudinary.Destroy(deleteParams);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Aviso: Falló intento de borrar imagen Cloudinary {imageUrlOrPath}. {ex.Message}");
        }
    }
}