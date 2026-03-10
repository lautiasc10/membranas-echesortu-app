using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Quote
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        
        public string ClientName { get; set; } = string.Empty;
        public string ClientAddress { get; set; } = string.Empty;
        public string ClientCity { get; set; } = string.Empty;
        public string WorkLocation { get; set; } = string.Empty;

        public decimal Total { get; set; }

        public List<QuoteDetail> QuoteDetails { get; set; } = new();

        public Quote() { }

        public Quote(string clientName, string clientAddress, string clientCity, string workLocation)
        {
            ClientName = clientName;
            ClientAddress = clientAddress;
            ClientCity = clientCity;
            WorkLocation = workLocation;
        }
    }
}
