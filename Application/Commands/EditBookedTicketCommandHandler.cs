using Acceloka.Api.Application.DTOs;
using Acceloka.Api.Common.Exceptions;
using Acceloka.Api.Infrastructure.Data.Repositories;
using MediatR;

namespace Acceloka.Api.Application.Commands;

public class EditBookedTicketCommandHandler : IRequestHandler<EditBookedTicketCommand, List<EditBookedTicketResponse>>
{
    private readonly IBookedTicketRepository _bookedTicketRepository;
    private readonly ITicketRepository _ticketRepository;

    public EditBookedTicketCommandHandler(
        IBookedTicketRepository bookedTicketRepository,
        ITicketRepository ticketRepository)
    {
        _bookedTicketRepository = bookedTicketRepository;
        _ticketRepository = ticketRepository;
    }

    public async Task<List<EditBookedTicketResponse>> Handle(EditBookedTicketCommand request, CancellationToken cancellationToken)
    {
        var exists = await _bookedTicketRepository.BookedTicketIdExistsAsync(request.BookedTicketId, cancellationToken);
        if (!exists)
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc7807#section-3.1",
                "Not Found",
                $"Booked tiket Id {request.BookedTicketId} tidak terdaftar");
        }

        var responses = new List<EditBookedTicketResponse>();

        foreach (var ticketItem in request.Request.Tickets)
        {
            var bookedTicket = await _bookedTicketRepository.GetBookedTicketAsync(
                request.BookedTicketId,
                ticketItem.KodeTiket,
                cancellationToken);

            if (bookedTicket == null)
            {
                throw new ProblemDetailsException(
                    404,
                    "https://tools.ietf.org/html/rfc7807#section-3.1",
                    "Not Found",
                    $"Kode tiket {ticketItem.KodeTiket} tidak terdaftar");
            }

            if (ticketItem.Quantity < 1)
            {
                throw new ProblemDetailsException(
                    400,
                    "https://tools.ietf.org/html/rfc7807#section-3.1",
                    "Bad Request",
                    "Minimum quantity adalah 1");
            }

            var remainingQuota = await _ticketRepository.GetRemainingQuotaAsync(ticketItem.KodeTiket, cancellationToken);
            var currentBookedQty = bookedTicket.Qty;
            var newTotalBooked = currentBookedQty + (ticketItem.Quantity - bookedTicket.Qty);

            if (newTotalBooked > remainingQuota + currentBookedQty)
            {
                throw new ProblemDetailsException(
                    400,
                    "https://tools.ietf.org/html/rfc7807#section-3.1",
                    "Bad Request",
                    $"Quantity melebihi quota yang tersedia untuk tiket {ticketItem.KodeTiket}");
            }

            bookedTicket.Qty = ticketItem.Quantity;

            if (bookedTicket.Qty == 0)
            {
                await _bookedTicketRepository.DeleteBookedTicketAsync(
                    request.BookedTicketId,
                    ticketItem.KodeTiket,
                    cancellationToken);
            }
            else
            {
                await _bookedTicketRepository.UpdateBookedTicketAsync(bookedTicket, cancellationToken);
            }

            var ticket = await _ticketRepository.GetTicketByCodeAsync(ticketItem.KodeTiket, cancellationToken);
            if (ticket != null)
            {
                var finalRemainingQuota = await _ticketRepository.GetRemainingQuotaAsync(ticketItem.KodeTiket, cancellationToken);
                responses.Add(new EditBookedTicketResponse
                {
                    TicketCode = ticket.KodeTiket,
                    TicketName = ticket.NamaTiket,
                    CategoryName = ticket.Kategori,
                    SisaQuantity = finalRemainingQuota
                });
            }
        }

        var allBookedTickets = await _bookedTicketRepository.GetBookedTicketsByBookingIdAsync(request.BookedTicketId, cancellationToken);
        if (!allBookedTickets.Any())
        {
            await _bookedTicketRepository.DeleteAllBookedTicketsByBookingIdAsync(request.BookedTicketId, cancellationToken);
        }

        return responses;
    }
}