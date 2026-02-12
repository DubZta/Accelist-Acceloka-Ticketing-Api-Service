namespace Acceloka.Api.Application.DTOs;

public class BookTicketRequest
{
    public List<TicketBookingItem> Tickets { get; set; } = new();
}

public class TicketBookingItem
{
    public string KodeTiket { get; set; } = string.Empty;
    public int Quantity { get; set; }
}