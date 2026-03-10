using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IQuoteService
{
    Task<List<QuoteDto>> GetAllQuotesAsync();
    Task<QuoteDto> GetByIdAsync(int id);
    Task<QuoteDto> CreateQuoteAsync(QuoteRequest request);
    Task<QuoteDto> UpdateQuoteAsync(int id, UpdateQuoteRequest request);
    Task DeleteQuoteAsync(int id);
}
