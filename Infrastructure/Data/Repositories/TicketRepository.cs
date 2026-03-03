using Acceloka.Api.Domain;
using Acceloka.Api.Infrastructure.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Api.Infrastructure.Data.Repositories;

public class TicketRepository : ITicketRepository
{
    private readonly AccelokaDbContext _context;

    public TicketRepository(AccelokaDbContext context)
    {
        _context = context;
    }

    public async Task<List<Ticket>> GetAvailableTicketsAsync(
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
        CancellationToken cancellationToken = default)
    {
        var query = _context.Tiket.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(namaKategori))
        {
            query = query.Where(t => t.Kategori.Contains(namaKategori));
        }

        if (!string.IsNullOrWhiteSpace(kodeTiket))
        {
            query = query.Where(t => t.KodeTiket.Contains(kodeTiket));
        }

        if (!string.IsNullOrWhiteSpace(namaTiket))
        {
            query = query.Where(t => t.NamaTiket.Contains(namaTiket));
        }

        if (harga.HasValue)
        {
            query = query.Where(t => t.Harga <= harga.Value);
        }

        if (tanggalEventMinimal.HasValue)
        {
            var startOfDay = tanggalEventMinimal.Value.Date;
            query = query.Where(t => t.EventDate >= startOfDay);
        }
 
        if (tanggalEventMaksimal.HasValue)
        {
            // Include everything up to the end of the specified day (23:59:59.999)
            var endOfDay = tanggalEventMaksimal.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(t => t.EventDate <= endOfDay);
        }

        if (string.IsNullOrWhiteSpace(orderBy))
        {
            query = query.OrderByDescending(t => t.EventDate).ThenBy(t => t.Harga);
        }
        else
        {
            var isDescending = orderState?.ToLower() == "desc";
            query = orderBy.ToLower() switch
            {
                "kodetiket" => isDescending ? query.OrderByDescending(t => t.KodeTiket) : query.OrderBy(t => t.KodeTiket),
                "namatiket" => isDescending ? query.OrderByDescending(t => t.NamaTiket) : query.OrderBy(t => t.NamaTiket),
                "kategori" => isDescending ? query.OrderByDescending(t => t.Kategori) : query.OrderBy(t => t.Kategori),
                "harga" or "price" => isDescending ? query.OrderByDescending(t => t.Harga) : query.OrderBy(t => t.Harga),
                "eventdate" or "date" => isDescending ? query.OrderByDescending(t => t.EventDate) : query.OrderBy(t => t.EventDate),
                "quota" => isDescending ? query.OrderByDescending(t => t.Quota) : query.OrderBy(t => t.Quota),
                _ => query.OrderByDescending(t => t.EventDate).ThenBy(t => t.Harga)
            };
        }

        if (page.HasValue && pageSize.HasValue && page.Value > 0 && pageSize.Value > 0)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<Ticket?> GetTicketByCodeAsync(string kodeTiket, CancellationToken cancellationToken = default)
    {
        return await _context.Tiket.FirstOrDefaultAsync(t => t.KodeTiket == kodeTiket, cancellationToken);
    }

    public async Task<bool> TicketExistsAsync(string kodeTiket, CancellationToken cancellationToken = default)
    {
        return await _context.Tiket.AnyAsync(t => t.KodeTiket == kodeTiket, cancellationToken);
    }

    public async Task<int> GetRemainingQuotaAsync(string kodeTiket, CancellationToken cancellationToken = default)
    {
        var ticket = await GetTicketByCodeAsync(kodeTiket, cancellationToken);
        if (ticket == null)
        {
            return 0;
        }

        var bookedQuantity = await _context.Bookedtiket
            .Where(bt => bt.KodeTiket == kodeTiket)
            .SumAsync(bt => (int?)bt.Qty ?? 0, cancellationToken);

        return ticket.Quota - bookedQuantity;
    }
}