namespace Domain.Entities
{
    public class QuoteDetail
    {
        public int Id { get; set; }

        public int QuoteId { get; set; }
        public Quote Quote { get; set; } = null!;

        public string ProductName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal Subtotal { get; private set; }

        public QuoteDetail() { }

        public QuoteDetail(string productName, int quantity, decimal unitPrice)
        {
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
            Subtotal = quantity * unitPrice;
        }

        public void Recalculate()
        {
            Subtotal = Quantity * UnitPrice;
        }
    }
}
