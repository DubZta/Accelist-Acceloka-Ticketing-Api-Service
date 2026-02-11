using Acceloka.Api.Application.DTOs;
using MediatR;

namespace Acceloka.Api.Application.Commands;

public class BookTicketCommand : IRequest<BookTicketResponse>
{
    public BookTicketRequest Request { get; set; } = new();
}

