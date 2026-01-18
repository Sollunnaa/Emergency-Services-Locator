using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emergency_Services_Locator.Migrations
{
    /// <inheritdoc />
    public partial class FacilityModelChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "facility_type",
                table: "Facilities",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "facility_type",
                table: "Facilities");
        }
    }
}
