using Acceloka.Api.Application.DTOs;
using FluentValidation;

namespace Acceloka.Api.Application.Validators;

public class BookTicketRequestValidator : AbstractValidator<BookTicketRequest>
{
    public BookTicketRequestValidator()
    {
        RuleFor(x => x.Tickets)
            .NotEmpty()
            .WithMessage("Tickets tidak boleh kosong");

        RuleForEach(x => x.Tickets)
            .SetValidator(new TicketBookingItemValidator());
    }
}

public class TicketBookingItemValidator : AbstractValidator<TicketBookingItem>
{
    public TicketBookingItemValidator()
    {
        RuleFor(x => x.KodeTiket)
            .NotEmpty()
            .WithMessage("KodeTiket tidak boleh kosong");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Quantity harus lebih besar dari 0");
    }
}

