using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;

namespace Application.Services;

public class SaleService : ISaleService
{
    private readonly ISaleRepository _saleRepository;
    private readonly IClientRepository _clientRepository;
    private readonly IProductVariantRepository _variantRepository;
    private readonly IUnitOfWork _unitOfWork;

    private const string WalkInClientName = "Consumidor Final";

    public SaleService(
        ISaleRepository saleRepository,
        IClientRepository clientRepository,
        IProductVariantRepository variantRepository,
        IUnitOfWork unitOfWork)
    {
        _saleRepository = saleRepository;
        _clientRepository = clientRepository;
        _variantRepository = variantRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<SaleDto>> GetAllSalesAsync()
    {
        var sales = await _saleRepository.ListAsync();
        return SaleDto.CreateList(sales);
    }

    public async Task<SaleDto> GetByIdAsync(int id)
    {
        var sale = await _saleRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("SALE_NOT_FOUND");

        return SaleDto.Create(sale);
    }

    public async Task<SaleDto> CreateSaleAsync(SaleRequest request)
    {
        var clientId = await ResolveClientIdAsync(request.ClientId);

        var sale = new Sale
        {
            Date = DateTime.UtcNow,
            ClientId = clientId,
            SaleDetails = new List<SaleDetail>()
        };

        await ProcessSaleDetailsAsync(sale, request.Details);

        _saleRepository.Add(sale);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _saleRepository.GetByIdAsync(sale.Id)
            ?? throw new NotFoundException("SALE_NOT_FOUND");

        return SaleDto.Create(saved);
    }

    public async Task<SaleDto> UpdateSaleAsync(int id, UpdateSaleRequest request)
    {
        var sale = await _saleRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("SALE_NOT_FOUND");

        var clientId = await ResolveClientIdAsync(request.ClientId);
        sale.ClientId = clientId;

        // Restore old stock before clearing details
        sale.SaleDetails ??= new List<SaleDetail>();
        foreach (var oldDetail in sale.SaleDetails.ToList())
        {
            var oldVariant = await _variantRepository.GetByIdAsync(oldDetail.ProductVariantId);
            if (oldVariant != null && oldVariant.CurrentStock.HasValue)
            {
                oldVariant.CurrentStock += oldDetail.Quantity;
                _variantRepository.Update(oldVariant);
            }
        }

        sale.SaleDetails.Clear();
        await ProcessSaleDetailsAsync(sale, request.Details);

        _saleRepository.Update(sale);
        await _unitOfWork.SaveChangesAsync();

        var saved = await _saleRepository.GetByIdAsync(sale.Id)
            ?? throw new NotFoundException("SALE_NOT_FOUND");

        return SaleDto.Create(saved);
    }

    public async Task DeleteSaleAsync(int id)
    {
        var sale = await _saleRepository.GetByIdAsync(id)
            ?? throw new NotFoundException("SALE_NOT_FOUND");

        _saleRepository.Delete(sale);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task<int> ResolveClientIdAsync(int? requestClientId)
    {
        if (requestClientId.HasValue)
        {
            var client = await _clientRepository.GetByIdAsync(requestClientId.Value)
                ?? throw new NotFoundException("CLIENT_NOT_FOUND");
            return client.Id;
        }

        return (await GetOrCreateWalkInClientAsync()).Id;
    }

    private async Task ProcessSaleDetailsAsync(Sale sale, List<SaleDetailRequest> details)
    {
        if (details == null || details.Count == 0)
            throw new AppValidationException("SALE_DETAILS_REQUIRED");

        foreach (var d in details)
        {
            if (d.Quantity <= 0)
                throw new AppValidationException("INVALID_QUANTITY");

            var variant = await _variantRepository.GetByIdAsync(d.ProductVariantId)
                ?? throw new NotFoundException("VARIANT_NOT_FOUND");

            if (variant.CurrentStock.HasValue)
            {
                if (variant.CurrentStock.Value < d.Quantity)
                    throw new AppValidationException("INSUFFICIENT_STOCK");
                
                variant.CurrentStock -= d.Quantity;
                _variantRepository.Update(variant);
            }

            var detail = new SaleDetail
            {
                ProductVariantId = d.ProductVariantId,
                Quantity = d.Quantity,
                UnitPrice = variant.SalePrice,
                UnitCost = variant.PurchasePrice,
            };

            detail.Recalculate();
            sale.SaleDetails.Add(detail);
        }

        sale.Total = sale.SaleDetails.Sum(x => x.Subtotal);
    }

    private async Task<Client> GetOrCreateWalkInClientAsync()
    {
        var existing = await _clientRepository.GetByNameAsync(WalkInClientName);
        if (existing != null) return existing;

        var walkIn = Client.CreateGuest(WalkInClientName, email: null);
        _clientRepository.Add(walkIn);
        await _unitOfWork.SaveChangesAsync();

        return walkIn;
    }

    public async Task<PagedResult<SaleDto>> GetPagedSalesAsync(int page, int pageSize, string? search, string? status, DateTime? fromDate, DateTime? toDate, string? sort)
    {
        var (sales, totalCount) = await _saleRepository.GetPagedAsync(page, pageSize, search, status, fromDate, toDate, sort);

        return new PagedResult<SaleDto>
        {
            Data = SaleDto.CreateList(sales),
            TotalCount = totalCount,
            Page = page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }
}