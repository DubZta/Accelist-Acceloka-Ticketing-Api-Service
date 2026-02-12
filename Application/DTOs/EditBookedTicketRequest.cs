namespace Acceloka.Api.Application.DTOs;

public class EditBookedTicketRequest
{
    public List<EditTicketItem> Tickets { get; set; } = new();
}

public class EditTicketItem
{
    public string KodeTiket { get; set; } = string.Empty;
    public int Quantity { get; set; }
}