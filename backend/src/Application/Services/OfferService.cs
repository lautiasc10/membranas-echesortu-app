using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class OfferService : IOfferService
{
    private readonly IOfferRepository _offerRepository;
    private readonly IProductRepository _productRepository;
    private readonly IImageStorageService _imageService;
    private readonly IUnitOfWork _unitOfWork;

    public OfferService(
        IOfferRepository offerRepository,
        IProductRepository productRepository,
        IImageStorageService imageService,
        IUnitOfWork unitOfWork)
    {
        _offerRepository = offerRepository;
        _productRepository = productRepository;
        _imageService = imageService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OfferDto> CreateAsync(CreateOfferRequest request)
    {
        if (request.Type == OfferType.ProductBased)
        {
            if (!request.ProductId.HasValue)
                throw new AppValidationException("Se requiere un Producto para las ofertas basadas en producto.");

            var productExists = await _productRepository.GetByIdAsync(request.ProductId.Value) != null;
            if (!productExists)
                throw new NotFoundException("PRODUCT_NOT_FOUND");
        }
        else if (request.Type == OfferType.CustomPromo && string.IsNullOrEmpty(request.CustomImageUrl))
        {
            throw new AppValidationException("Se requiere una imagen para promociones libres.");
        }

        var offer = new Offer
        {
            Title = request.Title ?? string.Empty,
            Description = request.Description ?? string.Empty,
            Type = request.Type,
            ProductId = request.Type == OfferType.ProductBased ? request.ProductId : null,
            ProductVariantId = request.Type == OfferType.ProductBased ? request.ProductVariantId : null,
            DiscountPercentage = request.DiscountPercentage,
            PromoPrice = request.PromoPrice,
            StartDate = request.StartDate ?? DateTime.UtcNow,
            EndDate = request.EndDate ?? DateTime.UtcNow.AddDays(7),
            IsActive = request.IsActive ?? true,
            CustomImageUrl = request.CustomImageUrl
        };

        _offerRepository.Add(offer);
        await _unitOfWork.SaveChangesAsync();

        var createdOffer = await _offerRepository.GetByIdAsync(offer.Id)
            ?? throw new NotFoundException("OFFER_NOT_FOUND");

        return OfferDto.Create(createdOffer);
    }

    public async Task DeleteAsync(int id)
    {
        var offer = await _offerRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("OFFER_NOT_FOUND");

        if (!string.IsNullOrEmpty(offer.CustomImageUrl))
            _imageService.DeleteIfExists(offer.CustomImageUrl);

        _offerRepository.Delete(offer);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<OfferDto>> GetActiveOffersAsync()
    {
        var offers = await _offerRepository.GetActiveOffersAsync(DateTime.UtcNow);
        return OfferDto.CreateList(offers);
    }

    public async Task<OfferDto> GetByIdAsync(int id)
    {
        var offer = await _offerRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("OFFER_NOT_FOUND");

        return OfferDto.Create(offer);
    }

    public async Task<PagedResult<OfferDto>> GetPagedAsync(int page, int pageSize, bool onlyActive)
    {
        var (data, total) = await _offerRepository.GetPagedAsync(page, pageSize, onlyActive);
        var dtos = OfferDto.CreateList(data);

        return new PagedResult<OfferDto>
        {
            Data = dtos,
            TotalCount = total,
            Page = page,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<OfferDto> UpdateAsync(int id, UpdateOfferRequest request)
    {
        var offer = await _offerRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("OFFER_NOT_FOUND");

        if (offer.Type == OfferType.CustomPromo)
        {
            var nextImage = request.CustomImageUrl ?? offer.CustomImageUrl;
            if (string.IsNullOrEmpty(nextImage))
                throw new AppValidationException("Se requiere una imagen para promociones libres.");
        }

        offer.Title = request.Title ?? offer.Title;
        offer.Description = request.Description ?? offer.Description;
        offer.DiscountPercentage = request.DiscountPercentage ?? offer.DiscountPercentage;
        offer.PromoPrice = request.PromoPrice ?? offer.PromoPrice;
        offer.StartDate = request.StartDate ?? offer.StartDate;
        offer.EndDate = request.EndDate ?? offer.EndDate;
        offer.IsActive = request.IsActive ?? offer.IsActive;
        offer.CustomImageUrl = request.CustomImageUrl ?? offer.CustomImageUrl;
        offer.UpdatedAt = DateTime.UtcNow;

        _offerRepository.Update(offer);
        await _unitOfWork.SaveChangesAsync();

        var updatedOffer = await _offerRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("OFFER_NOT_FOUND");

        return OfferDto.Create(updatedOffer);
    }
}