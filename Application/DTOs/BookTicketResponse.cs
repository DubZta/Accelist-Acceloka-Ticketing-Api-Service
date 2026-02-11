namespace Acceloka.Api.Application.DTOs;

public class BookTicketResponse
{
    public List<TicketDetailDto> Tickets { get; set; } = new();
    public List<TicketsPerCategoryDto> TicketsPerCategories { get; set; } = new();
    public decimal PriceSummary { get; set; }
    public int TotalTickets { get; set; }
}

public class TicketDetailDto
{
    public string TicketCode { get; set; }
    public string TicketName { get; set; }
    public DateTime EventDate { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

public class TicketsPerCategoryDto
{
    public int QuantityPerCategory { get; set; }
    public string CategoryName { get; set; }
    public decimal SummaryPrice { get; set; }
    public List<TicketDetailDto> Tickets { get; set; }
}