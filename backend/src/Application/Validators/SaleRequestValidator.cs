using Application.Models.Requests;
using FluentValidation;

namespace Application.Validators;

public class SaleRequestValidator : AbstractValidator<SaleRequest>
{
    public SaleRequestValidator()
    {
        RuleFor(x => x.Details)
            .NotEmpty().WithMessage("SALE_DETAILS_REQUIRED");

        RuleForEach(x => x.Details).SetValidator(new SaleDetailRequestValidator());
    }
}
