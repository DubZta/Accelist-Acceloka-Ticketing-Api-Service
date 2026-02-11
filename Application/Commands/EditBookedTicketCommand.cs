using Acceloka.Api.Application.DTOs;
using MediatR;

namespace Acceloka.Api.Application.Commands;

public class EditBookedTicketCommand : IRequest<List<EditBookedTicketResponse>>
{
    public string BookedTicketId { get; set; } = string.Empty;
    public EditBookedTicketRequest Request { get; set; } = new();
}

