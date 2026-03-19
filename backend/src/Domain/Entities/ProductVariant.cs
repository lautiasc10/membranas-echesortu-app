using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class ProductVariant
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public string? Weight { get; set; }
        public string? Color { get; set; }
        public string? Size { get; set; } // For measurements like 20cm x 10m

        public decimal SalePrice { get; set; }
        public decimal PurchasePrice { get; set; }

        public int? CurrentStock { get; set; }
        public int? MinimumStock { get; set; }

        public string? ImageUrl { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; } = null!;

        public List<SaleDetail> SaleDetails { get; set; } = new();

        public ProductVariant() { }


        public ProductVariant(int productId, string? weight, string? color, string? size, decimal salePrice, decimal purchasePrice, int? currentStock, int? minimumStock, string? imageUrl)
        {
            ProductId = productId;
            Weight = weight;
            Color = color;
            Size = size;
            SalePrice = salePrice;
            PurchasePrice = purchasePrice;
            CurrentStock = currentStock;
            MinimumStock = minimumStock;
            ImageUrl = imageUrl;
        }
    }

}
