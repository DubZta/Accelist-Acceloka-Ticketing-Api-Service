using Acceloka.Api.Application.Commands;
using Acceloka.Api.Application.DTOs;
using Acceloka.Api.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Acceloka.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class TicketController : ControllerBase
{
    private readonly IMediator _mediator;

    public TicketController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-available-ticket")]
    public async Task<ActionResult<List<GetAvailableTicketResponse>>> GetAvailableTickets(
        [FromQuery] string? namaKategori,
        [FromQuery] string? kodeTiket,
        [FromQuery] string? namaTiket,
        [FromQuery] decimal? harga,
        [FromQuery] DateTime? tanggalEventMinimal,
        [FromQuery] DateTime? tanggalEventMaksimal,
        [FromQuery] string? orderBy,
        [FromQuery] string? orderState,
        [FromQuery] int? page,
        [FromQuery] int? pageSize,
        CancellationToken cancellationToken)
    {
        var query = new GetAvailableTicketsQuery
        {
            NamaKategori = namaKategori,
            KodeTiket = kodeTiket,
            NamaTiket = namaTiket,
            Harga = harga,
            TanggalEventMinimal = tanggalEventMinimal,
            TanggalEventMaksimal = tanggalEventMaksimal,
            OrderBy = orderBy,
            OrderState = orderState,
            Page = page,
            PageSize = pageSize
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost("book-ticket")]
    public async Task<ActionResult<object>> BookTicket(
    [FromBody] BookTicketRequest request,
    CancellationToken cancellationToken)
    {
        var command = new BookTicketCommand
        {
            Request = request
        };

        var result = await _mediator.Send(command, cancellationToken);

        var formattedResponse = new
        {
            tickets = result.Tickets.Select(t => new
            {
                ticketCode = t.TicketCode,
                ticketName = t.TicketName,
                price = t.Price
            }).ToList(),
            ticketsPerCategories = result.TicketsPerCategories.Select(c => new
            {
                categoryName = c.CategoryName,
                summaryPrice = c.SummaryPrice,
                tickets = c.Tickets.Select(t => new
                {
                    ticketCode = t.TicketCode,
                    ticketName = t.TicketName,
                    price = t.Price
                }).ToList()
            }).ToList(),
            priceSummary = result.PriceSummary,
            totalTickets = result.TotalTickets
        };

        return CreatedAtAction(
            nameof(GetBookedTicket),
            new { bookedTicketId = Guid.NewGuid().ToString() },
            formattedResponse);
    }

    [HttpGet("get-booked-ticket/{bookedTicketId}")]
    public async Task<ActionResult<object>> GetBookedTicket(
        [FromRoute] string bookedTicketId,
        CancellationToken cancellationToken)
    {
        var query = new GetBookedTicketQuery(bookedTicketId);
        var result = await _mediator.Send(query, cancellationToken);
        var formattedResponse = new
        {
            priceSummary = result.PriceSummary,
            ticketsPerCategories = result.TicketsPerCategories.Select(c => new
            {
                quantityPerCategory = c.QuantityPerCategory,
                categoryName = c.CategoryName,
                summaryPrice = c.SummaryPrice,
                tickets = c.Tickets.Select(t => new
                {
                    ticketCode = t.TicketCode,
                    ticketName = t.TicketName,
                    eventDate = t.EventDate.ToString("dd-MM-yyyy HH:mm"),
                    quantity = t.Quantity,
                    price = t.Price
                }).ToList()
            }).ToList()
        };

        return Ok(formattedResponse);
    }

    [HttpPut("edit-booked-ticket/{bookedTicketId}")]
    public async Task<ActionResult<List<EditBookedTicketResponse>>> EditBookedTicket(
        [FromRoute] string bookedTicketId,
        [FromBody] EditBookedTicketRequest request,
        CancellationToken cancellationToken)
    {
        var command = new EditBookedTicketCommand
        {
            BookedTicketId = bookedTicketId,
            Request = request
        };

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("revoke-ticket/{bookedTicketId}/{kodeTicket}/{qty}")]
    public async Task<ActionResult<RevokeTicketResponse>> RevokeTicket(
        [FromRoute] string bookedTicketId,
        [FromRoute] string kodeTicket,
        [FromRoute] int qty,
        CancellationToken cancellationToken)
    {
        var command = new RevokeTicketCommand
        {
            BookedTicketId = bookedTicketId,
            KodeTicket = kodeTicket,
            Qty = qty
        };

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}