using Acceloka.Api.Application.Validators;
using Acceloka.Api.Common.Middleware;
using Acceloka.Api.Infrastructure.Data.DbContext;
using Acceloka.Api.Infrastructure.Data.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.File(
        path: Path.Combine("logs", $"Log-{DateTime.Now:yyyyMMdd}.txt"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: null,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Configure DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=AccelokaDb;Trusted_Connection=True;MultipleActiveResultSets=true";

builder.Services.AddDbContext<AccelokaDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Repositories
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IBookedTicketRepository, BookedTicketRepository>();

// Configure MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

// Configure FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<BookTicketRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<EditBookedTicketRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Add Problem Details Middleware
app.UseMiddleware<ProblemDetailsMiddleware>();

app.UseAuthorization();

app.MapControllers();

// Ensure logs directory exists
var logsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "logs");
if (!Directory.Exists(logsDirectory))
{
    Directory.CreateDirectory(logsDirectory);
}

app.Lifetime.ApplicationStarted.Register(() =>
{
    Console.WriteLine("================================================================");
    Console.WriteLine("               Acceloka API is running successfully              ");
    Console.WriteLine("Test Endpoint: http://localhost:5176/api/v1/get-available-ticket");
    Console.WriteLine("================================================================");
});

app.Run();
