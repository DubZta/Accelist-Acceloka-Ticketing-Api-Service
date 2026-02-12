using Acceloka.Api.Application.DTOs;
using Acceloka.Api.Infrastructure.Data.Repositories;
using MediatR;

namespace Acceloka.Api.Application.Queries;

public class GetAvailableTicketsQueryHandler : IRequestHandler<GetAvailableTicketsQuery, List<GetAvailableTicketResponse>>
{
    private readonly ITicketRepository _ticketRepository;

    public GetAvailableTicketsQueryHandler(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<List<GetAvailableTicketResponse>> Handle(GetAvailableTicketsQuery request, CancellationToken cancellationToken)
    {
        var tickets = await _ticketRepository.GetAvailableTicketsAsync(
            request.NamaKategori,
            request.KodeTiket,
            request.NamaTiket,
            request.Harga,
            request.TanggalEventMinimal,
            request.TanggalEventMaksimal,
            request.OrderBy,
            request.OrderState,
            request.Page,
            request.PageSize,
            cancellationToken);

        var remainingQuotas = new Dictionary<string, int>();
        foreach (var ticket in tickets)
        {
            if (!remainingQuotas.ContainsKey(ticket.KodeTiket))
            {
                var remainingQuota = await _ticketRepository.GetRemainingQuotaAsync(ticket.KodeTiket, cancellationToken);
                remainingQuotas[ticket.KodeTiket] = remainingQuota;
            }
        }

        return tickets.Select(t => new GetAvailableTicketResponse
        {
            CategoryName = t.Kategori,
            TicketCode = t.KodeTiket,
            TicketName = t.NamaTiket,
            EventDate = t.EventDate.ToString("dd-MM-yyyy HH:mm"),
            Price = t.Harga,
            Quota = remainingQuotas.GetValueOrDefault(t.KodeTiket, 0)
        }).ToList();
    }
}