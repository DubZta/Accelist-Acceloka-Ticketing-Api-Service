using Acceloka.Api.Application.DTOs;
using Acceloka.Api.Common.Exceptions;
using Acceloka.Api.Domain;
using Acceloka.Api.Infrastructure.Data.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Acceloka.Api.Application.Queries;

public class GetBookedTicketQueryHandler : IRequestHandler<GetBookedTicketQuery, BookedTicketResponse>
{
    private readonly IBookedTicketRepository _bookedTicketRepository;
    private readonly ITicketRepository _ticketRepository;

    public GetBookedTicketQueryHandler(
        IBookedTicketRepository bookedTicketRepository,
        ITicketRepository ticketRepository)
    {
        _bookedTicketRepository = bookedTicketRepository;
        _ticketRepository = ticketRepository;
    }

    public async Task<BookedTicketResponse> Handle(
        GetBookedTicketQuery query,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query.BookedTicketId))
        {
            throw new ProblemDetailsException(
                400,
                "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                "Bad Request",
                "Booked ticket ID tidak boleh kosong");
        }

        var bookedTickets = await _bookedTicketRepository
            .GetBookedTicketsByBookingIdAsync(query.BookedTicketId, cancellationToken);

        if (bookedTickets == null || !bookedTickets.Any())
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc9110#section-15.5.3",
                "Not Found",
                $"Booking dengan ID {query.BookedTicketId} tidak ditemukan");
        }

        var ticketsPerCategory = new Dictionary<string, TicketsPerCategoryDto>();

        foreach (var bookedTicket in bookedTickets)
        {
            var ticket = await _ticketRepository
                .GetTicketByCodeAsync(bookedTicket.KodeTiket, cancellationToken);

            if (ticket == null)
            {
                throw new ProblemDetailsException(
                    404,
                    "https://tools.ietf.org/html/rfc9110#section-15.5.3",
                    "Not Found",
                    $"Tiket dengan kode {bookedTicket.KodeTiket} tidak ditemukan");
            }

            if (!ticketsPerCategory.ContainsKey(ticket.Kategori))
            {
                ticketsPerCategory[ticket.Kategori] = new TicketsPerCategoryDto
                {
                    QuantityPerCategory = 0,
                    CategoryName = ticket.Kategori,
                    SummaryPrice = 0,
                    Tickets = new List<TicketDetailDto>()
                };
            }

            var category = ticketsPerCategory[ticket.Kategori];

            var ticketTotalPrice = ticket.Harga * bookedTicket.Qty;

            category.QuantityPerCategory += bookedTicket.Qty;
            category.SummaryPrice += ticketTotalPrice;

            category.Tickets.Add(new TicketDetailDto
            {
                TicketCode = ticket.KodeTiket,
                TicketName = ticket.NamaTiket,
                EventDate = ticket.EventDate,
                Quantity = bookedTicket.Qty,
                Price = ticket.Harga
            });
        }

        var priceSummary = ticketsPerCategory.Values.Sum(c => c.SummaryPrice);

        return new BookedTicketResponse
        {
            PriceSummary = priceSummary,
            TicketsPerCategories = ticketsPerCategory.Values.ToList()
        };
    }
}