namespace Domain.Entities
{
    public class SaleDetail
    {
        public int Id { get; set; }

        public int SaleId { get; set; }
        public Sale Sale { get; set; } = null!;

        public int ProductVariantId { get; set; }
        public ProductVariant ProductVariant { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }

        public decimal Subtotal { get; private set; }
        public decimal Profit { get; private set; }

        public SaleDetail() { }

        public SaleDetail(int productVariantId, int quantity, decimal unitPrice, decimal unitCost)
        {
            ProductVariantId = productVariantId;
            Quantity = quantity;
            UnitPrice = unitPrice;
            UnitCost = unitCost;

            Subtotal = quantity * unitPrice;
            Profit = quantity * (unitPrice - unitCost);
        }

        public void Recalculate()
        {
            Subtotal = Quantity * UnitPrice;
            Profit = (UnitPrice - UnitCost) * Quantity;
        }

    }
}
