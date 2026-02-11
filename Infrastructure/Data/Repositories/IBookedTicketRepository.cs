using Acceloka.Api.Domain;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Acceloka.Api.Infrastructure.Data.Repositories;

public interface IBookedTicketRepository
{
    Task<List<BookedTicket>> GetBookedTicketsByBookingIdAsync(string bookedTicketId, CancellationToken cancellationToken = default);
    Task<BookedTicket?> GetBookedTicketAsync(string bookedTicketId, string kodeTiket, CancellationToken cancellationToken = default);
    Task<bool> BookedTicketIdExistsAsync(string bookedTicketId, CancellationToken cancellationToken = default);
    Task AddBookedTicketAsync(BookedTicket bookedTicket, CancellationToken cancellationToken = default);
    Task UpdateBookedTicketAsync(BookedTicket bookedTicket, CancellationToken cancellationToken = default);
    Task DeleteBookedTicketAsync(string bookedTicketId, string kodeTiket, CancellationToken cancellationToken = default);
    Task DeleteAllBookedTicketsByBookingIdAsync(string bookedTicketId, CancellationToken cancellationToken = default);
    Task<int> GetTotalBookedQuantityAsync(string kodeTiket, CancellationToken cancellationToken = default);
}