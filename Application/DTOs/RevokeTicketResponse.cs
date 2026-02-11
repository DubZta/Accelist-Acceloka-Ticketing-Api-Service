namespace Acceloka.Api.Application.DTOs;

public class RevokeTicketResponse
{
    public string KodeTicket { get; set; } = string.Empty;
    public string NamaTiket { get; set; } = string.Empty;
    public string NamaKategori { get; set; } = string.Empty;
    public int SisaQuantity { get; set; }
}

