namespace Acceloka.Api.Common.Exceptions;

public class ProblemDetailsException : Exception
{
    public int StatusCode { get; }
    public string Type { get; }
    public string Title { get; }
    public string Detail { get; }
    public string? Instance { get; }

    public ProblemDetailsException(
        int statusCode,
        string type,
        string title,
        string detail,
        string? instance = null) : base(detail)
    {
        StatusCode = statusCode;
        Type = type;
        Title = title;
        Detail = detail;
        Instance = instance;
    }
}

