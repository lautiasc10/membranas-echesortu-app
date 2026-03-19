using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IOfferService
{
    Task<PagedResult<OfferDto>> GetPagedAsync(int page, int pageSize, bool onlyActive);
    Task<List<OfferDto>> GetActiveOffersAsync();
    Task<OfferDto> GetByIdAsync(int id);
    Task<OfferDto> CreateAsync(CreateOfferRequest request);
    Task<OfferDto> UpdateAsync(int id, UpdateOfferRequest request);
    Task DeleteAsync(int id);
}
