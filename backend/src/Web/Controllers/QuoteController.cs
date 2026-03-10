using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers;

[Route("api/quotes")]
[ApiController]
[Authorize(Roles = "admin,superadmin")]  // Solo el admin puede gestionar presupuestos
public class QuoteController : ControllerBase
{
    private readonly IQuoteService _quoteService;

    public QuoteController(IQuoteService quoteService)
    {
        _quoteService = quoteService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuoteDto>>> GetAllQuotes()
    {
        return Ok(await _quoteService.GetAllQuotesAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuoteDto>> GetById([FromRoute] int id)
    {
        return Ok(await _quoteService.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<ActionResult<QuoteDto>> Create([FromBody] QuoteRequest request)
    {
        var quote = await _quoteService.CreateQuoteAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = quote.Id }, quote);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<QuoteDto>> UpdateQuote([FromRoute] int id, [FromBody] UpdateQuoteRequest request)
    {
        return Ok(await _quoteService.UpdateQuoteAsync(id, request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuote([FromRoute] int id)
    {
        await _quoteService.DeleteQuoteAsync(id);
        return NoContent();
    }
}
