namespace Domain.Entities
{
    public class Sale
    {
        public int Id { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        public int? ClientId { get; set; }
        public Client? Client { get; set; }

        public decimal Total { get; set; }
        /* public string Status { get; set; } = string.Empty; */

        public List<SaleDetail> SaleDetails { get; set; } = new();

        public Sale() { }


        public Sale(int? clientId)
        {
            ClientId = clientId;
        }

}

}
