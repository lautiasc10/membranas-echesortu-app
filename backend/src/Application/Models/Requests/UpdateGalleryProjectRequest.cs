using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public class UpdateGalleryProjectRequest
{
    [StringLength(150)]
    public string? Title { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    public DateTime? WorkDate { get; set; }
    public bool? IsVisible { get; set; }
    public int? OrderIndex { get; set; }
    public string? BeforeImageUrl { get; set; }
    public string? AfterImageUrl { get; set; }
}