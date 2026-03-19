using Domain.Entities;

namespace Domain.Interfaces;

public interface IOfferRepository : IRepository<Offer>
{
    Task<(List<Offer> Data, int TotalCount)> GetPagedAsync(int page, int pageSize, bool onlyActive);
    Task<List<Offer>> GetActiveOffersAsync(DateTime currentDate);
}
