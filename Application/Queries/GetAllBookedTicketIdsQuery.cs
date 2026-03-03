using MediatR;
using System.Collections.Generic;

namespace Acceloka.Api.Application.Queries;

public class GetAllBookedTicketIdsQuery : IRequest<List<string>>
{
}