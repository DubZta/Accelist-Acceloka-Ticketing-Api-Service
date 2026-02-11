namespace Acceloka.Api.Application.DTOs;

public class GetAvailableTicketResponse
{
    public string CategoryName { get; set; } = string.Empty;
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public string EventDate { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quota { get; set; }
}

