using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IGalleryService
{
    Task<PagedResult<GalleryProjectDto>> GetPagedAsync(int page, int pageSize, bool onlyVisible);
    Task<GalleryProjectDto> GetByIdAsync(int id);
    Task<GalleryProjectDto> CreateAsync(CreateGalleryProjectRequest request);
    Task<GalleryProjectDto> UpdateAsync(int id, UpdateGalleryProjectRequest request);
    Task DeleteAsync(int id);
}
