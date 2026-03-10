using ClosedXML.Excel;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Services
{
    public class ExcelImporterService
    {
        private readonly ApplicationDbContext _context;

        public ExcelImporterService(ApplicationDbContext context)
        {
            _context = context;
        }

        public void ImportAndPersist(string filePath)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                using var workbook = new XLWorkbook(filePath);
                var worksheet = workbook.Worksheet(1);

                var used = worksheet.RangeUsed();
                if (used == null) return;

                var rows = used.RowsUsed().Skip(1);

                foreach (var row in rows)
                {
                    var categoryName = row.Cell(1).GetString()?.Trim();
                    var brandName    = row.Cell(2).GetString()?.Trim();
                    var productName  = row.Cell(3).GetString()?.Trim();
                    var description  = row.Cell(4).GetString()?.Trim();

                    var weight = row.Cell(5).GetString()?.Trim();
                    var color  = row.Cell(6).GetString()?.Trim();
                    var size   = row.Cell(7).GetString()?.Trim();

                    if (string.IsNullOrWhiteSpace(categoryName) ||
                        string.IsNullOrWhiteSpace(productName))
                        continue;
                    
                    if (string.IsNullOrWhiteSpace(brandName))
                        brandName = "SIN MARCA";

                    decimal.TryParse(row.Cell(8).GetString(), out var salePrice);
                    decimal.TryParse(row.Cell(9).GetString(), out var purchasePrice);
                    int.TryParse(row.Cell(10).GetString(), out var currentStock);
                    int.TryParse(row.Cell(11).GetString(), out var minStock);

                    string? imageUrl = row.Cell(12).GetString()?.Trim();
                    if (string.IsNullOrWhiteSpace(imageUrl))
                        imageUrl = null;

                    var category = _context.Categories.FirstOrDefault(c => c.Name == categoryName);
                    if (category == null)
                    {
                        category = new Category(categoryName);
                        _context.Categories.Add(category);
                        _context.SaveChanges();
                    }

                    var brand = _context.Brands.FirstOrDefault(b => b.Name == brandName);
                    if (brand == null)
                    {
                        brand = new Brand(brandName);
                        _context.Brands.Add(brand);
                        _context.SaveChanges();
                    }

                    var product = _context.Products
                        .FirstOrDefault(p => p.Name == productName && p.BrandId == brand.Id);

                    if (product == null)
                    {
                        product = new Product(productName, description, category.Id, brand.Id, imageUrl);
                        _context.Products.Add(product);
                        _context.SaveChanges();
                    }
                    else
                    {
                        if (!string.IsNullOrWhiteSpace(imageUrl) && product.ImageUrl != imageUrl)
                        {
                            product.ImageUrl = imageUrl;
                            _context.Products.Update(product);
                            _context.SaveChanges();
                        }
                    }

                    var existingVariant = _context.ProductVariants.FirstOrDefault(v =>
                        v.ProductId == product.Id &&
                        v.Color == color &&
                        v.Weight == weight &&
                        v.Size == size
                    );

                    if (existingVariant == null)
                    {
                        var variant = new ProductVariant(
                            product.Id,
                            weight ?? "",
                            color ?? "",
                            size ?? "",
                            salePrice,
                            purchasePrice,
                            currentStock,
                            minStock,
                            "default.png"
                        );

                        variant.Product = product;
                        _context.ProductVariants.Add(variant);
                    }
                    else
                    {
                        existingVariant.CurrentStock += currentStock;
                        existingVariant.MinimumStock = minStock;
                        existingVariant.SalePrice = salePrice;
                        existingVariant.PurchasePrice = purchasePrice;
                    }
                }

                _context.SaveChanges();
                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception($"Error al persistir los datos del Excel: {ex.Message}", ex);
            }
        }
    }
}
