namespace Domain.Entities
{
    public class Brand
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public List<Product> Products { get; set; } = new();

        public Brand() { }

        public Brand(string? name)
        {
            Name = name;
        }
    }
}
