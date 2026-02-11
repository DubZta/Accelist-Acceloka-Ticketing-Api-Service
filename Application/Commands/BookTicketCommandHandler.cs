using Acceloka.Api.Application.DTOs;
using Acceloka.Api.Common.Exceptions;
using Acceloka.Api.Domain;
using Acceloka.Api.Infrastructure.Data.Repositories;
using Acceloka.Api.Infrastructure.Data.DbContext;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Acceloka.Api.Application.Commands;

public class BookTicketCommandHandler : IRequestHandler<BookTicketCommand, BookTicketResponse>
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IBookedTicketRepository _bookedTicketRepository;
    private readonly AccelokaDbContext _dbContext;

    public BookTicketCommandHandler(
        ITicketRepository ticketRepository,
        IBookedTicketRepository bookedTicketRepository,
        AccelokaDbContext dbContext)
    {
        _ticketRepository = ticketRepository;
        _bookedTicketRepository = bookedTicketRepository;
        _dbContext = dbContext;
    }

    public async Task<BookTicketResponse> Handle(
        BookTicketCommand request,
        CancellationToken cancellationToken)
    {
        if (request.Request.Tickets == null || !request.Request.Tickets.Any())
        {
            throw new ProblemDetailsException(
                400,
                "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                "Bad Request",
                "Tickets tidak boleh kosong");
        }

        var bookedTicketId = Guid.NewGuid().ToString();
        var bookingDate = DateTime.Now;

        var ticketCache = new Dictionary<string, Ticket>();
        var ticketsPerCategory = new Dictionary<string, BookTicketsPerCategoryDto>();
        var allTicketDetails = new List<BookTicketDetailDto>();

        using var transaction = await _dbContext.Database
            .BeginTransactionAsync(cancellationToken);

        try
        {
            // ===== PHASE 1: Validation =====
            foreach (var ticketItem in request.Request.Tickets)
            {
                if (ticketItem.Quantity <= 0)
                {
                    throw new ProblemDetailsException(
                        400,
                        "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                        "Bad Request",
                        "Quantity harus lebih besar dari 0");
                }

                var ticket = await _ticketRepository
                    .GetTicketByCodeAsync(ticketItem.KodeTiket, cancellationToken);

                if (ticket == null)
                {
                    throw new ProblemDetailsException(
                        400,
                        "https://tools.ietf.org/html/rfc7807#section-3.1",
                        "Bad Request",
                        $"Kode tiket {ticketItem.KodeTiket} tidak terdaftar");
                }

                var remainingQuota = await _ticketRepository
                    .GetRemainingQuotaAsync(ticketItem.KodeTiket, cancellationToken);

                if (remainingQuota <= 0)
                {
                    throw new ProblemDetailsException(
                        400,
                        "https://tools.ietf.org/html/rfc7807#section-3.1",
                        "Bad Request",
                        $"Quota tiket {ticketItem.KodeTiket} sudah habis");
                }

                if (ticketItem.Quantity > remainingQuota)
                {
                    throw new ProblemDetailsException(
                        400,
                        "https://tools.ietf.org/html/rfc7807#section-3.1",
                        "Bad Request",
                        $"Quantity melebihi quota yang tersedia untuk tiket {ticketItem.KodeTiket}");
                }

                if (ticket.EventDate <= bookingDate)
                {
                    throw new ProblemDetailsException(
                        400,
                        "https://tools.ietf.org/html/rfc7807#section-3.1",
                        "Bad Request",
                        $"Tanggal event tiket {ticketItem.KodeTiket} harus lebih besar dari tanggal booking");
                }

                ticketCache[ticketItem.KodeTiket] = ticket;
            }

            // ===== PHASE 2: Booking =====
            foreach (var ticketItem in request.Request.Tickets)
            {
                var ticket = ticketCache[ticketItem.KodeTiket];

                // Save to database
                var bookedTicket = new BookedTicket
                {
                    BookedTicketId = bookedTicketId,
                    KodeTiket = ticketItem.KodeTiket,
                    Qty = ticketItem.Quantity,
                    BookingDate = bookingDate
                };

                await _bookedTicketRepository.AddBookedTicketAsync(bookedTicket, cancellationToken);

                // ✅ Build POST-specific ticket detail (NO quantity, NO eventDate)
                var ticketDetail = new BookTicketDetailDto
                {
                    TicketCode = ticket.KodeTiket,
                    TicketName = ticket.NamaTiket,
                    Price = ticket.Harga
                };

                allTicketDetails.Add(ticketDetail);

                // Build category structure
                if (!ticketsPerCategory.ContainsKey(ticket.Kategori))
                {
                    ticketsPerCategory[ticket.Kategori] = new BookTicketsPerCategoryDto
                    {
                        CategoryName = ticket.Kategori,
                        SummaryPrice = 0,
                        Tickets = new List<BookTicketDetailDto>()
                    };
                }

                var category = ticketsPerCategory[ticket.Kategori];
                category.SummaryPrice += ticket.Harga * ticketItem.Quantity;
                category.Tickets.Add(ticketDetail);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            var priceSummary = ticketsPerCategory.Values.Sum(t => t.SummaryPrice);
            var totalTickets = request.Request.Tickets.Sum(t => t.Quantity);

            return new BookTicketResponse
            {
                Tickets = allTicketDetails,
                TicketsPerCategories = ticketsPerCategory.Values.ToList(),
                PriceSummary = priceSummary,
                TotalTickets = totalTickets
            };
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}