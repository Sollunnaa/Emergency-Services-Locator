using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emergency_Services_Locator.Migrations
{
    /// <inheritdoc />
    public partial class separatedLongLang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "coordinates",
                table: "Maps",
                newName: "longitude");

            migrationBuilder.AddColumn<string>(
                name: "latitude",
                table: "Maps",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "latitude",
                table: "Maps");

            migrationBuilder.RenameColumn(
                name: "longitude",
                table: "Maps",
                newName: "coordinates");
        }
    }
}
