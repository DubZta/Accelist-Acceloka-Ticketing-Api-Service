// ✅ NEW FILE - For POST API only
namespace Acceloka.Api.Application.DTOs;

public class BookTicketResponse
{
    public List<BookTicketDetailDto> Tickets { get; set; } = new();
    public List<BookTicketsPerCategoryDto> TicketsPerCategories { get; set; } = new();
    public decimal PriceSummary { get; set; }
    public int TotalTickets { get; set; }
}

public class BookTicketDetailDto  // ✅ For POST API - NO EventDate, NO Quantity
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public decimal Price { get; set; }  // ✅ Only these 3 fields
}

public class BookTicketsPerCategoryDto  // ✅ For POST API
{
    public string CategoryName { get; set; } = string.Empty;
    public decimal SummaryPrice { get; set; }
    public List<BookTicketDetailDto> Tickets { get; set; } = new();
}