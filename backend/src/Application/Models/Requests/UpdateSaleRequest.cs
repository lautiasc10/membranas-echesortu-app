using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests;

public record UpdateSaleRequest
(
    int? ClientId,
    
    List<SaleDetailRequest> Details

);