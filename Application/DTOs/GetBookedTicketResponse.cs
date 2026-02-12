using System.Collections.Generic;

namespace Acceloka.Api.Application.DTOs;

public class BookedTicketResponse
{
    public decimal PriceSummary { get; set; }
    public List<TicketsPerCategoryDto> TicketsPerCategories { get; set; } = new();
}

public class TicketsPerCategoryDto
{
    public int QuantityPerCategory { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal SummaryPrice { get; set; }
    public List<TicketDetailDto> Tickets { get; set; } = new();
}

public class TicketDetailDto
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}