using Acceloka.Api.Application.DTOs;
using Acceloka.Api.Common.Exceptions;
using Acceloka.Api.Domain;
using Acceloka.Api.Infrastructure.Data.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

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

        if (string.IsNullOrWhiteSpace(request.BookedTicketId))
        {
            throw new ProblemDetailsException(
                400,
                "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                "Bad Request",
                "Booked ticket ID tidak boleh kosong");
        }

        if (string.IsNullOrWhiteSpace(request.KodeTicket))
        {
            throw new ProblemDetailsException(
                400,
                "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                "Bad Request",
                "Kode tiket tidak boleh kosong");
        }

        if (request.Qty <= 0)
        {
            throw new ProblemDetailsException(
                400,
                "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                "Bad Request",
                "Quantity harus lebih besar dari 0");
        }

        var bookedTicket = await _bookedTicketRepository.GetBookedTicketAsync(
            request.BookedTicketId,
            request.KodeTicket,
            cancellationToken);

        if (bookedTicket == null)
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc9110#section-15.5.3",
                "Not Found",
                $"Kode tiket {request.KodeTicket} tidak ditemukan untuk booking ID {request.BookedTicketId}");
        }

        if (request.Qty > bookedTicket.Qty)
        {
            throw new ProblemDetailsException(
                400,
                "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                "Bad Request",
                $"Qty melebihi jumlah tiket yang telah di-booking ({bookedTicket.Qty} tiket tersedia)");
        }

        var ticket = await _ticketRepository.GetTicketByCodeAsync(request.KodeTicket, cancellationToken);
        if (ticket == null)
        {
            throw new ProblemDetailsException(
                404,
                "https://tools.ietf.org/html/rfc9110#section-15.5.3",
                "Not Found",
                $"Tiket dengan kode {request.KodeTicket} tidak ditemukan di database");
        }

        var remainingQuantity = bookedTicket.Qty - request.Qty;

        if (remainingQuantity == 0)
        {
            await _bookedTicketRepository.DeleteBookedTicketAsync(
                request.BookedTicketId,
                request.KodeTicket,
                cancellationToken);
        }
        else
        {
            bookedTicket.Qty = remainingQuantity;
            await _bookedTicketRepository.UpdateBookedTicketAsync(bookedTicket, cancellationToken);
        }

        var allBookedTickets = await _bookedTicketRepository.GetBookedTicketsByBookingIdAsync(
            request.BookedTicketId,
            cancellationToken);

        if (!allBookedTickets.Any())
        {
            await _bookedTicketRepository.DeleteAllBookedTicketsByBookingIdAsync(
                request.BookedTicketId,
                cancellationToken);
        }

        return new RevokeTicketResponse
        {
            TicketCode = ticket.KodeTiket,       // ✅ English property name
            TicketName = ticket.NamaTiket,       // ✅ English property name
            CategoryName = ticket.Kategori,      // ✅ English property name
            QuantityLeft = remainingQuantity     // ✅ English property name
        };
    }
}