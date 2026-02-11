using Acceloka.Api.Domain;
using Acceloka.Api.Infrastructure.Data;
using Acceloka.Api.Infrastructure.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Acceloka.Api.Infrastructure.Data.Repositories;

public class BookedTicketRepository : IBookedTicketRepository
{
    private readonly AccelokaDbContext _context;

    public BookedTicketRepository(AccelokaDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookedTicket>> GetBookedTicketsByBookingIdAsync(string bookedTicketId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookedtiket
            .Where(bt => bt.BookedTicketId == bookedTicketId)
            .ToListAsync(cancellationToken);
    }

    public async Task<BookedTicket?> GetBookedTicketAsync(string bookedTicketId, string kodeTiket, CancellationToken cancellationToken = default)
    {
        return await _context.Bookedtiket
            .FirstOrDefaultAsync(bt => bt.BookedTicketId == bookedTicketId && bt.KodeTiket == kodeTiket, cancellationToken);
    }

    public async Task<bool> BookedTicketIdExistsAsync(string bookedTicketId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookedtiket.AnyAsync(bt => bt.BookedTicketId == bookedTicketId, cancellationToken);
    }

    public async Task AddBookedTicketAsync(BookedTicket bookedTicket, CancellationToken cancellationToken = default)
    {
        await _context.Bookedtiket.AddAsync(bookedTicket, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateBookedTicketAsync(BookedTicket bookedTicket, CancellationToken cancellationToken = default)
    {
        _context.Bookedtiket.Update(bookedTicket);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteBookedTicketAsync(string bookedTicketId, string kodeTiket, CancellationToken cancellationToken = default)
    {
        var bookedTicket = await GetBookedTicketAsync(bookedTicketId, kodeTiket, cancellationToken);
        if (bookedTicket != null)
        {
            _context.Bookedtiket.Remove(bookedTicket);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task DeleteAllBookedTicketsByBookingIdAsync(string bookedTicketId, CancellationToken cancellationToken = default)
    {
        var bookedTickets = await GetBookedTicketsByBookingIdAsync(bookedTicketId, cancellationToken);
        if (bookedTickets.Any())
        {
            _context.Bookedtiket.RemoveRange(bookedTickets);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<int> GetTotalBookedQuantityAsync(string kodeTiket, CancellationToken cancellationToken = default)
    {
        return await _context.Bookedtiket
            .Where(bt => bt.KodeTiket == kodeTiket)
            .SumAsync(bt => (int?)bt.Qty ?? 0, cancellationToken);
    }
}