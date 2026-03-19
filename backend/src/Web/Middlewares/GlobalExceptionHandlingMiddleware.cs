using System.Net;
using System.Text.Json;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Web.Middleware;

public class GlobalExceptionHandlingMiddleware : IMiddleware
{
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;
    public GlobalExceptionHandlingMiddleware(
        ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _logger = logger;
    }
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (AppValidationException ex)
        {
            _logger.LogError(ex, ex.Message);

            int statusCode = (int)HttpStatusCode.BadRequest;

            var response = new { message = ex.Message, traceId = context.TraceIdentifier };
            string json = JsonSerializer.Serialize(response);

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(json);
        }
        catch (BadRequestException ex)
        {
            _logger.LogWarning(ex, ex.Message);

            int statusCode = (int)HttpStatusCode.BadRequest;

            var response = new { message = ex.Message, traceId = context.TraceIdentifier };
            string json = JsonSerializer.Serialize(response);

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(json);
        }
        catch (NotFoundException ex)
        {
            _logger.LogError(ex, ex.Message);

            int statusCode = (int)HttpStatusCode.NotFound;

            ProblemDetails problem = new()
            {
                Status = statusCode,
                Type = "https://membranas-echesortu/errors/not-found",
                Title = "NotFoundException",
                Detail = ex.Message,
                Extensions = { ["traceId"] = context.TraceIdentifier }
            };

            string json = JsonSerializer.Serialize(problem);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            await context.Response.WriteAsync(json);
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, ex.Message);

            int statusCode = (int)HttpStatusCode.Unauthorized;

            var response = new { message = ex.Message, traceId = context.TraceIdentifier };
            string json = JsonSerializer.Serialize(response);

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(json);
        }
        catch (ConcurrencyException ex)
        {
            _logger.LogWarning(ex, ex.Message);

            int statusCode = (int)HttpStatusCode.Conflict;

            var response = new { message = ex.Message, traceId = context.TraceIdentifier, code = "CONCURRENCY_CONFLICT" };
            string json = JsonSerializer.Serialize(response);

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            int statusCode = (int)HttpStatusCode.InternalServerError;

            context.Response.StatusCode = statusCode;

            ProblemDetails problem = new()
            {
                Status = statusCode,
                Type = "https://membranas-echesortu/errors/internal-server-error",
                Title = "Server error",
                Detail = "An internal server error has occurred.",
                Extensions = { ["traceId"] = context.TraceIdentifier }
            };

            string json = JsonSerializer.Serialize(problem);

            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(json);
        }
    }
}