using Acceloka.Api.Domain;

namespace Acceloka.Api.Infrastructure.Data.Repositories;

public interface ITicketRepository
{
    Task<List<Ticket>> GetAvailableTicketsAsync(
        string? namaKategori,
        string? kodeTiket,
        string? namaTiket,
        decimal? harga,
        DateTime? tanggalEventMinimal,
        DateTime? tanggalEventMaksimal,
        string? orderBy,
        string? orderState,
        int? page,
        int? pageSize,
        CancellationToken cancellationToken = default);

    Task<Ticket?> GetTicketByCodeAsync(string kodeTiket, CancellationToken cancellationToken = default);
    Task<bool> TicketExistsAsync(string kodeTiket, CancellationToken cancellationToken = default);
    Task<int> GetRemainingQuotaAsync(string kodeTiket, CancellationToken cancellationToken = default);
}