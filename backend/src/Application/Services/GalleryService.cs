using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class GalleryService : IGalleryService
{
    private readonly IGalleryRepository _galleryRepository;
    private readonly IImageStorageService _imageService;
    private readonly IUnitOfWork _unitOfWork;

    public GalleryService(
        IGalleryRepository galleryRepository,
        IImageStorageService imageService,
        IUnitOfWork unitOfWork)
    {
        _galleryRepository = galleryRepository;
        _imageService = imageService;
        _unitOfWork = unitOfWork;
    }

    public async Task<GalleryProjectDto> CreateAsync(CreateGalleryProjectRequest request)
    {
        var project = new GalleryProject
        {
            Title = request.Title ?? string.Empty,
            Description = request.Description ?? string.Empty,
            WorkDate = request.WorkDate,
            IsVisible = request.IsVisible ?? true,
            OrderIndex = request.OrderIndex ?? 0,
            BeforeImageUrl = request.BeforeImageUrl,
            AfterImageUrl = request.AfterImageUrl
        };

        _galleryRepository.Add(project);
        await _unitOfWork.SaveChangesAsync();

        return GalleryProjectDto.Create(project);
    }

    public async Task DeleteAsync(int id)
    {
        var project = await _galleryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("PROJECT_NOT_FOUND");

        if (!string.IsNullOrEmpty(project.BeforeImageUrl))
            _imageService.DeleteIfExists(project.BeforeImageUrl);

        if (!string.IsNullOrEmpty(project.AfterImageUrl))
            _imageService.DeleteIfExists(project.AfterImageUrl);

        _galleryRepository.Delete(project);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<GalleryProjectDto> GetByIdAsync(int id)
    {
        var project = await _galleryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("PROJECT_NOT_FOUND");

        return GalleryProjectDto.Create(project);
    }

    public async Task<PagedResult<GalleryProjectDto>> GetPagedAsync(int page, int pageSize, bool onlyVisible)
    {
        var (data, total) = await _galleryRepository.GetPagedAsync(page, pageSize, onlyVisible);
        var dtos = GalleryProjectDto.CreateList(data);

        return new PagedResult<GalleryProjectDto>
        {
            Data = dtos,
            TotalCount = total,
            Page = page,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<GalleryProjectDto> UpdateAsync(int id, UpdateGalleryProjectRequest request)
    {
        var project = await _galleryRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("PROJECT_NOT_FOUND");

        project.Title = request.Title ?? project.Title;
        project.Description = request.Description ?? project.Description;
        project.WorkDate = request.WorkDate ?? project.WorkDate;
        project.IsVisible = request.IsVisible ?? project.IsVisible;
        project.OrderIndex = request.OrderIndex ?? project.OrderIndex;
        project.BeforeImageUrl = request.BeforeImageUrl ?? project.BeforeImageUrl;
        project.AfterImageUrl = request.AfterImageUrl ?? project.AfterImageUrl;
        project.UpdatedAt = DateTime.UtcNow;

        Console.WriteLine($"[SERVICE DEBUG] Gallery {id} after mapping: Title='{project.Title}', IsVisible={project.IsVisible}");

        _galleryRepository.Update(project);
        await _unitOfWork.SaveChangesAsync();

        Console.WriteLine($"[SERVICE DEBUG] Changes saved for Gallery {id}");

        return GalleryProjectDto.Create(project);
    }
}