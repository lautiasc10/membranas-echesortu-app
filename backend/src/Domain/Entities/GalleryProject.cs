namespace Domain.Entities;

public class GalleryProject
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? WorkDate { get; set; }
    public bool IsVisible { get; set; } = true;
    public int OrderIndex { get; set; } = 0;
    
    // Rutas a Cloudinary
    public string? BeforeImageUrl { get; set; }
    public string? AfterImageUrl { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
