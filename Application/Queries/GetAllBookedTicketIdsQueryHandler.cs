using Acceloka.Api.Infrastructure.Data.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Acceloka.Api.Application.Queries;

public class GetAllBookedTicketIdsQueryHandler : IRequestHandler<GetAllBookedTicketIdsQuery, List<string>>
{
    private readonly IBookedTicketRepository _bookedTicketRepository;

    public GetAllBookedTicketIdsQueryHandler(IBookedTicketRepository bookedTicketRepository)
    {
        _bookedTicketRepository = bookedTicketRepository;
    }

    public async Task<List<string>> Handle(GetAllBookedTicketIdsQuery request, CancellationToken cancellationToken)
    {
        return await _bookedTicketRepository.GetAllBookedTicketIdsAsync(cancellationToken);
    }
}
