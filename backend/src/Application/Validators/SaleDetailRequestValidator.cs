using Application.Models.Requests;
using FluentValidation;

namespace Application.Validators;

public class SaleDetailRequestValidator : AbstractValidator<SaleDetailRequest>
{
    public SaleDetailRequestValidator()
    {
        RuleFor(x => x.ProductVariantId)
            .GreaterThan(0).WithMessage("VARIANT_NOT_FOUND");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("INVALID_QUANTITY");
    }
}
