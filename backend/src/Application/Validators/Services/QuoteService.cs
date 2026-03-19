using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class QuoteService : IQuoteService
{
    private readonly IQuoteRepository _quoteRepository;
    private readonly IUnitOfWork _unitOfWork;

    public QuoteService(
        IQuoteRepository quoteRepository,
        IUnitOfWork unitOfWork)
    {
        _quoteRepository = quoteRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<QuoteDto>> GetAllQuotesAsync()
    {
        var quotes = await _quoteRepository.ListAsync();
        return QuoteDto.CreateList(quotes);
    }

    public async Task<QuoteDto> GetByIdAsync(int id)
    {
        var quote = await _quoteRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("QUOTE_NOT_FOUND");

        return QuoteDto.Create(quote);
    }

    public async Task<QuoteDto> CreateQuoteAsync(QuoteRequest request)
    {
        if (request.Details == null || request.Details.Count == 0)
            throw new AppValidationException("QUOTE_DETAILS_REQUIRED");

        var quote = new Quote
        {
            Date = DateTime.UtcNow,
            ClientName = request.ClientName ?? "",
            ClientAddress = request.ClientAddress ?? "",
            ClientCity = request.ClientCity ?? "",
            WorkLocation = request.WorkLocation ?? "",
            QuoteDetails = new List<QuoteDetail>()
        };

        foreach (var d in request.Details)
        {
            if (d.Quantity <= 0)
                throw new AppValidationException("INVALID_QUANTITY");

            var detail = new QuoteDetail
            {
                ProductName = d.ProductName ?? "",
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice
            };

            detail.Recalculate();
            quote.QuoteDetails.Add(detail);
        }

        quote.Total = quote.QuoteDetails.Sum(x => x.Subtotal);

        _quoteRepository.Add(quote);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _quoteRepository.GetByIdAsync(quote.Id)
            ?? throw new NotFoundException("QUOTE_NOT_FOUND");

        return QuoteDto.Create(saved);
    }

    public async Task<QuoteDto> UpdateQuoteAsync(int id, UpdateQuoteRequest request)
    {
        var quote = await _quoteRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("QUOTE_NOT_FOUND");

        if (request.Details == null || request.Details.Count == 0)
            throw new AppValidationException("QUOTE_DETAILS_REQUIRED");

        quote.ClientName = request.ClientName ?? "";
        quote.ClientAddress = request.ClientAddress ?? "";
        quote.ClientCity = request.ClientCity ?? "";
        quote.WorkLocation = request.WorkLocation ?? "";

        quote.QuoteDetails ??= new List<QuoteDetail>();
        quote.QuoteDetails.Clear();

        foreach (var d in request.Details)
        {
            if (d.Quantity <= 0)
                throw new AppValidationException("INVALID_QUANTITY");

            var detail = new QuoteDetail
            {
                ProductName = d.ProductName ?? "",
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice
            };

            detail.Recalculate();
            quote.QuoteDetails.Add(detail);
        }

        quote.Total = quote.QuoteDetails.Sum(x => x.Subtotal);

        _quoteRepository.Update(quote);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _quoteRepository.GetByIdAsync(quote.Id)
            ?? throw new NotFoundException("QUOTE_NOT_FOUND");

        return QuoteDto.Create(saved);
    }

    public async Task DeleteQuoteAsync(int id)
    {
        var quote = await _quoteRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("QUOTE_NOT_FOUND");

        _quoteRepository.Delete(quote);
        await _unitOfWork.SaveChangesAsync();
    }
}
