using Acceloka.Api.Application.DTOs;
using MediatR;

namespace Acceloka.Api.Application.Queries;

public class GetBookedTicketQuery : IRequest<BookedTicketResponse>
{
    public string BookedTicketId { get; set; }
    public GetBookedTicketQuery(string bookedTicketId)
    {
        BookedTicketId = bookedTicketId;
    }
}