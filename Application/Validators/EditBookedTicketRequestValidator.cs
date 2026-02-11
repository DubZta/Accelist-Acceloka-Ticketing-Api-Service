using Acceloka.Api.Application.DTOs;
using FluentValidation;

namespace Acceloka.Api.Application.Validators;

public class EditBookedTicketRequestValidator : AbstractValidator<EditBookedTicketRequest>
{
    public EditBookedTicketRequestValidator()
    {
        RuleFor(x => x.Tickets)
            .NotEmpty()
            .WithMessage("Tickets tidak boleh kosong");

        RuleForEach(x => x.Tickets)
            .SetValidator(new EditTicketItemValidator());
    }
}

public class EditTicketItemValidator : AbstractValidator<EditTicketItem>
{
    public EditTicketItemValidator()
    {
        RuleFor(x => x.KodeTiket)
            .NotEmpty()
            .WithMessage("KodeTiket tidak boleh kosong");

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Minimum quantity adalah 1");
    }
}

