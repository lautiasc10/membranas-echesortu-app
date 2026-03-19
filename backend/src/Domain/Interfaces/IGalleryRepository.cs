using Domain.Entities;

namespace Domain.Interfaces;

public interface IGalleryRepository : IRepository<GalleryProject>
{
    Task<(List<GalleryProject> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, bool onlyVisible);
}
