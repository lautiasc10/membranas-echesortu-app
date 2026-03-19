using Domain.Entities;

namespace Application.Models;

public record GalleryProjectDto(
    int Id,
    string Title,
    string Description,
    DateTime? WorkDate,
    bool IsVisible,
    int OrderIndex,
    string? BeforeImageUrl,
    string? AfterImageUrl,
    DateTime CreatedAt,
    DateTime? UpdatedAt)
{
    public static GalleryProjectDto Create(GalleryProject project)
    {
        return new GalleryProjectDto(
            project.Id,
            project.Title,
            project.Description,
            project.WorkDate,
            project.IsVisible,
            project.OrderIndex,
            project.BeforeImageUrl,
            project.AfterImageUrl,
            project.CreatedAt,
            project.UpdatedAt);
    }

    public static List<GalleryProjectDto> CreateList(IEnumerable<GalleryProject> projects)
    {
        return projects.Select(p => Create(p)).ToList();
    }
}
