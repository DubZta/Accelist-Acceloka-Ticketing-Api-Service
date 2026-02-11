using Acceloka.Api.Application.DTOs;
using MediatR;

namespace Acceloka.Api.Application.Queries;

public class GetAvailableTicketsQuery : IRequest<List<GetAvailableTicketResponse>>
{
    public string? NamaKategori { get; set; }
    public string? KodeTiket { get; set; }
    public string? NamaTiket { get; set; }
    public decimal? Harga { get; set; }
    public DateTime? TanggalEventMinimal { get; set; }
    public DateTime? TanggalEventMaksimal { get; set; }
    public string? OrderBy { get; set; }
    public string? OrderState { get; set; }
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}

