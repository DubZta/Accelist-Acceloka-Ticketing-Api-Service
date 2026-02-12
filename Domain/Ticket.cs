namespace Acceloka.Api.Domain;

public class Ticket
{
    public string KodeTiket { get; set; } = string.Empty;
    public string NamaTiket { get; set; } = string.Empty;
    public string Kategori { get; set; } = string.Empty;
    public decimal Harga { get; set; }
    public int Quota { get; set; }
    public DateTime EventDate { get; set; }
}