using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface ISaleService
{
    Task<List<SaleDto>> GetAllSalesAsync();
    Task<SaleDto> GetByIdAsync(int id);
    Task<SaleDto> CreateSaleAsync(SaleRequest request);
    Task<SaleDto> UpdateSaleAsync(int id, UpdateSaleRequest product);
    Task DeleteSaleAsync(int id);
    Task<PagedResult<SaleDto>> GetPagedSalesAsync(int page, int pageSize, string? search, string? status, DateTime? fromDate, DateTime? toDate, string? sort);
}