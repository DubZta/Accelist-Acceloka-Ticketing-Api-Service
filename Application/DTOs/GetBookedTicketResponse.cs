using System;
using System.Collections.Generic;

namespace Acceloka.Api.Application.DTOs;

public class BookedTicketResponse
{
    public decimal PriceSummary { get; set; }
    public List<TicketsPerCategoryDto> TicketsPerCategories { get; set; }
}