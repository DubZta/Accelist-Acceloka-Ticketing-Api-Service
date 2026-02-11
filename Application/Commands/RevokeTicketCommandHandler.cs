using Acceloka.Api.Application.DTOs;
using Acceloka.Api.Common.Exceptions;
using Acceloka.Api.Infrastructure.Data.Repositories;
using MediatR;

namespace Acceloka.Api.Application.Commands;

public class RevokeTicketCommandHandler : IRequestHandler<RevokeTicketCommand, RevokeTicketResponse>
{
    private readonly IBookedTicketRepository _bookedTicketRepository;
    private readonly ITicketRepository _ticketRepository;

    public RevokeTicketCommandHandler(
        IBookedTicketRepository bookedTicketRepository,
        ITicketRepository ticketRepository)
    {
        _bookedTicketRepository = bookedTicketRepository;
        _ticketRepository = ticketRepository;
    }

    public async Task<RevokeTicketResponse> Handle(RevokeTicketCommand request, CancellationToken cancellationToken)
    {
        var bookedTicketIdExists = await _bookedTicketRepository.BookedTicketIdExistsAsync(request.BookedTicketId, cancellationToken);
        if (!bookedTicketIdExists)
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc7807#section-3.1",
                "Not Found",
                $"Booked tiket Id {request.BookedTicketId} tidak terdaftar");
        }

        var ticketExists = await _ticketRepository.TicketExistsAsync(request.KodeTicket, cancellationToken);
        if (!ticketExists)
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc7807#section-3.1",
                "Not Found",
                $"Kode tiket {request.KodeTicket} tidak terdaftar");
        }

        var bookedTicket = await _bookedTicketRepository.GetBookedTicketAsync(
            request.BookedTicketId,
            request.KodeTicket,
            cancellationToken);

        if (bookedTicket == null)
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc7807#section-3.1",
                "Not Found",
                $"Kode tiket {request.KodeTicket} tidak ditemukan untuk BookedTicketId {request.BookedTicketId}");
        }

        if (request.Qty > bookedTicket.Qty)
        {
            throw new ProblemDetailsException(
                400,
                "https://tools.ietf.org/html/rfc7807#section-3.1",
                "Bad Request",
                $"Qty melebihi jumlah tiket yang sudah di-booking");
        }

        bookedTicket.Qty -= request.Qty;

        if (bookedTicket.Qty <= 0)
        {
            await _bookedTicketRepository.DeleteBookedTicketAsync(
                request.BookedTicketId,
                request.KodeTicket,
                cancellationToken);
        }
        else
        {
            await _bookedTicketRepository.UpdateBookedTicketAsync(bookedTicket, cancellationToken);
        }

        var allBookedTickets = await _bookedTicketRepository.GetBookedTicketsByBookingIdAsync(request.BookedTicketId, cancellationToken);
        if (!allBookedTickets.Any())
        {
            await _bookedTicketRepository.DeleteAllBookedTicketsByBookingIdAsync(request.BookedTicketId, cancellationToken);
        }

        var ticket = await _ticketRepository.GetTicketByCodeAsync(request.KodeTicket, cancellationToken);
        if (ticket == null)
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc7807#section-3.1",
                "Not Found",
                $"Tiket dengan kode {request.KodeTicket} tidak ditemukan");
        }

        var remainingQuota = await _ticketRepository.GetRemainingQuotaAsync(request.KodeTicket, cancellationToken);

        return new RevokeTicketResponse
        {
            KodeTicket = ticket.KodeTiket,
            NamaTiket = ticket.NamaTiket,
            NamaKategori = ticket.Kategori,
            SisaQuantity = remainingQuota
        };
    }
}

