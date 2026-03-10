using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin,superadmin")]  // Solo el admin puede importar Excel
public class ImportController : ControllerBase
{
    private readonly ExcelImporterService _importer;
    private readonly IConfiguration _configuration;

    public ImportController(ExcelImporterService importer, IConfiguration configuration)
    {
        _importer = importer;
        _configuration = configuration;
    }

    [HttpPost("cargar-excel")]
    public IActionResult Cargar()
    {
        string? ruta = _configuration["ExcelImport:FilePath"];
        
        if (string.IsNullOrWhiteSpace(ruta))
            return BadRequest("No se configuró la ruta del archivo Excel en appsettings.json (ExcelImport:FilePath).");
            
        _importer.ImportAndPersist(ruta);
        
        return Ok("¡Productos cargados con éxito en la DB!");
    }
}