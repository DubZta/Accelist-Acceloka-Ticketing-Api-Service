namespace Acceloka.Api.Domain;

public class BookedTicket
{
    public string BookedTicketId { get; set; } = string.Empty;
    public string KodeTiket { get; set; } = string.Empty;
    public int Qty { get; set; }
    public DateTime BookingDate { get; set; }
}

