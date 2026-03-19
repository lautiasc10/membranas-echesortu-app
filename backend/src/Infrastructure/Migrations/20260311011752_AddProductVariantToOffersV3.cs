using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductVariantToOffersV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductVariantId",
                table: "Offers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offers_ProductVariantId",
                table: "Offers",
                column: "ProductVariantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_ProductVariants_ProductVariantId",
                table: "Offers",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offers_ProductVariants_ProductVariantId",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_ProductVariantId",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "ProductVariantId",
                table: "Offers");
        }
    }
}
