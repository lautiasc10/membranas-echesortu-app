namespace Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } =  string.Empty;
        public string? Description { get; set; }
        public bool Active { get; set; } = true;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int BrandId { get; set; }
        public Brand Brand { get; set; } = null!;

        public string? ImageUrl { get; set; }


        public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
        public ICollection<Offer> Offers { get; set; } = new List<Offer>();

        public Product() { }

        public Product(string name, string? description, int categoryId, int brandId, string? imageUrl)
        {
            Name = name;
            Description = description;
            CategoryId = categoryId;
            BrandId = brandId;
            ImageUrl = imageUrl;
        }
    }

}

