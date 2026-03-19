using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Client> Clients { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleDetail> SaleDetails { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<QuoteDetail> QuoteDetails { get; set; }
        public DbSet<GalleryProject> GalleryProjects { get; set; }
        public DbSet<Offer> Offers { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Client ──
            modelBuilder.Entity<Client>(entity =>
            {
                entity.Property(c => c.Name).HasMaxLength(200).IsRequired();
                entity.Property(c => c.Email).HasMaxLength(200);
                entity.Property(c => c.PhoneNumber).HasMaxLength(50);
                entity.Property(c => c.Password).HasMaxLength(500);
                entity.Property(c => c.RefreshToken).HasMaxLength(200);

                entity.Property(c => c.RegistrationDate).IsRequired();

                entity.HasIndex(c => c.Email)
                    .IsUnique()
                    .HasFilter("[Email] IS NOT NULL");

                entity.HasIndex(c => c.PhoneNumber)
                    .IsUnique()
                    .HasFilter("[PhoneNumber] IS NOT NULL");

                entity.HasMany(c => c.Sales)
                    .WithOne(s => s.Client!)
                    .HasForeignKey(s => s.ClientId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ── Brand ──
            modelBuilder.Entity<Brand>(entity =>
            {
                entity.Property(b => b.Name).HasMaxLength(200).IsRequired();
            });

            // ── Category ──
            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(c => c.Name).HasMaxLength(200).IsRequired();
            });

            // ── Product ──
            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(p => p.Name).HasMaxLength(300).IsRequired();
                entity.Property(p => p.Description).HasMaxLength(1000);
                entity.Property(p => p.ImageUrl).HasMaxLength(500);

                entity.HasOne(p => p.Brand)
                    .WithMany(b => b.Products)
                    .HasForeignKey(p => p.BrandId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(p => p.ProductVariants)
                    .WithOne(v => v.Product)
                    .HasForeignKey(v => v.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── ProductVariant ──
            modelBuilder.Entity<ProductVariant>(entity =>
            {
                entity.Property(v => v.SalePrice).HasPrecision(18, 2);
                entity.Property(v => v.PurchasePrice).HasPrecision(18, 2);
                entity.Property(v => v.Color).HasMaxLength(100);
                entity.Property(v => v.Size).HasMaxLength(100);
                entity.Property(v => v.Weight).HasMaxLength(100);
                entity.Property(v => v.ImageUrl).HasMaxLength(500);
            });

            // ── Sale ──
            modelBuilder.Entity<Sale>(entity =>
            {
                entity.Property(s => s.Total).HasPrecision(18, 2);

                entity.HasMany(s => s.SaleDetails)
                    .WithOne(d => d.Sale)
                    .HasForeignKey(d => d.SaleId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── SaleDetail ──
            modelBuilder.Entity<SaleDetail>(entity =>
            {
                entity.Property(d => d.UnitPrice).HasPrecision(18, 2);
                entity.Property(d => d.UnitCost).HasPrecision(18, 2);
                entity.Property(d => d.Subtotal).HasPrecision(18, 2);
                entity.Property(d => d.Profit).HasPrecision(18, 2);

                entity.HasOne(d => d.ProductVariant)
                    .WithMany(v => v.SaleDetails)
                    .HasForeignKey(d => d.ProductVariantId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Quote ──
            modelBuilder.Entity<Quote>(entity =>
            {
                entity.Property(q => q.Total).HasPrecision(18, 2);
                entity.Property(q => q.ClientName).HasMaxLength(200);
                entity.Property(q => q.ClientAddress).HasMaxLength(300);
                entity.Property(q => q.ClientCity).HasMaxLength(150);
                entity.Property(q => q.WorkLocation).HasMaxLength(300);

                entity.HasMany(q => q.QuoteDetails)
                    .WithOne(qd => qd.Quote)
                    .HasForeignKey(qd => qd.QuoteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── QuoteDetail ──
            modelBuilder.Entity<QuoteDetail>(entity =>
            {
                entity.Property(qd => qd.UnitPrice).HasPrecision(18, 2);
                entity.Property(qd => qd.Subtotal).HasPrecision(18, 2);
                entity.Property(qd => qd.ProductName).HasMaxLength(300);
            });

            // ── GalleryProject ──
            modelBuilder.Entity<GalleryProject>(entity =>
            {
                entity.Property(g => g.Title).HasMaxLength(150).IsRequired();
                entity.Property(g => g.Description).HasMaxLength(1000);
                entity.Property(g => g.BeforeImageUrl).HasMaxLength(500);
                entity.Property(g => g.AfterImageUrl).HasMaxLength(500);
            });

            // ── Offer ──
            modelBuilder.Entity<Offer>(entity =>
            {
                entity.Property(o => o.Title).HasMaxLength(150).IsRequired();
                entity.Property(o => o.Description).HasMaxLength(1000);
                entity.Property(o => o.CustomImageUrl).HasMaxLength(500);
                entity.Property(o => o.DiscountPercentage).HasPrecision(5, 2);
                entity.Property(o => o.PromoPrice).HasPrecision(18, 2);

                entity.HasOne(o => o.Product)
                    .WithMany(p => p.Offers)
                    .HasForeignKey(o => o.ProductId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(o => o.ProductVariant)
                    .WithMany()
                    .HasForeignKey(o => o.ProductVariantId)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
