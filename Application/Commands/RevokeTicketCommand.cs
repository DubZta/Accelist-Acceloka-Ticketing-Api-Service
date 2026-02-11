using Acceloka.Api.Application.DTOs;
using MediatR;

namespace Acceloka.Api.Application.Commands;

public class RevokeTicketCommand : IRequest<RevokeTicketResponse>
{
    public string BookedTicketId { get; set; } = string.Empty;
    public string KodeTicket { get; set; } = string.Empty;
    public int Qty { get; set; }
}

