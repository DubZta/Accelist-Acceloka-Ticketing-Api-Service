using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accelist_Acceloka_Ticketing_Api_Service.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tiket",
                columns: table => new
                {
                    KodeTiket = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NamaTiket = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kategori = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Harga = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quota = table.Column<int>(type: "int", nullable: false),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tiket", x => x.KodeTiket);
                });

            migrationBuilder.CreateTable(
                name: "Bookedtiket",
                columns: table => new
                {
                    BookedTicketId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    KodeTiket = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Qty = table.Column<int>(type: "int", nullable: false),
                    BookingDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookedtiket", x => new { x.BookedTicketId, x.KodeTiket });
                    table.ForeignKey(
                        name: "FK_Bookedtiket_tiket_KodeTiket",
                        column: x => x.KodeTiket,
                        principalTable: "tiket",
                        principalColumn: "KodeTiket",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookedtiket_KodeTiket",
                table: "Bookedtiket",
                column: "KodeTiket");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookedtiket");

            migrationBuilder.DropTable(
                name: "tiket");
        }
    }
}
