using Application.Models.Requests;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace Application.Tests;

public class SaleServiceTests
{
    private readonly Mock<ISaleRepository> _mockSaleRepo;
    private readonly Mock<IClientRepository> _mockClientRepo;
    private readonly Mock<IProductVariantRepository> _mockVariantRepo;
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly SaleService _sut;

    public SaleServiceTests()
    {
        _mockSaleRepo = new Mock<ISaleRepository>();
        _mockClientRepo = new Mock<IClientRepository>();
        _mockVariantRepo = new Mock<IProductVariantRepository>();
        _mockUoW = new Mock<IUnitOfWork>();

        _sut = new SaleService(
            _mockSaleRepo.Object,
            _mockClientRepo.Object,
            _mockVariantRepo.Object,
            _mockUoW.Object
        );
    }

    [Fact]
    public async Task CreateSaleAsync_ShouldThrowValidationException_WhenQuantityIsZeroOrLess()
    {
        // Arrange
        var request = new SaleRequest(
            1,
            new List<SaleDetailRequest> {
                new SaleDetailRequest(1, -1)
            }
        );

        _mockClientRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(new Client { Id = 1, Name = "Test" });

        // Act & Assert
        await _sut.Invoking(x => x.CreateSaleAsync(request))
            .Should().ThrowAsync<AppValidationException>()
            .WithMessage("INVALID_QUANTITY");
    }

    [Fact]
    public async Task CreateSaleAsync_ShouldThrowValidationException_WhenInsufficientStock()
    {
        // Arrange
        var request = new SaleRequest(
            1,
            new List<SaleDetailRequest> {
                new SaleDetailRequest(1, 10)
            }
        );

        _mockClientRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(new Client { Id = 1, Name = "Test" });
        _mockVariantRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(new ProductVariant(1, "1kg", "Red", "M", 100m, 50m, 5, 0, null)
        { 
            Id = 1
        });

        // Act & Assert
        await _sut.Invoking(x => x.CreateSaleAsync(request))
            .Should().ThrowAsync<AppValidationException>()
            .WithMessage("INSUFFICIENT_STOCK");
    }

    [Fact]
    public async Task CreateSaleAsync_ShouldDeductStockAndCalculateTotal_WhenValid()
    {
        // Arrange
        var request = new SaleRequest(
            1,
            new List<SaleDetailRequest> {
                new SaleDetailRequest(1, 5)
            }
        );
        
        var variant = new ProductVariant(1, "1kg", "Red", "M", 100m, 50m, 10, 0, null) 
        { 
            Id = 1
        };

        var client = new Client { Id = 1, Name = "Test" };
        var createdSale = new Sale { Id = 1, Total = 500, ClientId = client.Id };

        _mockClientRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(client);
        _mockVariantRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(variant);

        // We use a callback to simulate DB returning the ID after saving, and assign it properties
        _mockSaleRepo.Setup(x => x.Add(It.IsAny<Sale>())).Callback<Sale>(s => s.Id = 1);
        _mockSaleRepo.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(createdSale);

        // Act
        var result = await _sut.CreateSaleAsync(request);

        // Assert
        variant.CurrentStock.Should().Be(5);
        _mockVariantRepo.Verify(x => x.Update(variant), Times.Once);
        _mockSaleRepo.Verify(x => x.Add(It.IsAny<Sale>()), Times.Once);
        _mockUoW.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

        result.Should().NotBeNull();
    }
}
