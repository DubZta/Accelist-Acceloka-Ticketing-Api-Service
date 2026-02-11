using Acceloka.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Api.Infrastructure.Data.DbContext;

public class AccelokaDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AccelokaDbContext(DbContextOptions<AccelokaDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tiket { get; set; }
    public DbSet<BookedTicket> Bookedtiket { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.ToTable("tiket");
            entity.HasKey(e => e.KodeTiket);
            entity.Property(e => e.KodeTiket).HasColumnName("KodeTiket");
            entity.Property(e => e.NamaTiket).HasColumnName("NamaTiket");
            entity.Property(e => e.Kategori).HasColumnName("Kategori");
            entity.Property(e => e.Harga).HasColumnName("Harga");
            entity.Property(e => e.Quota).HasColumnName("Quota");
            entity.Property(e => e.EventDate).HasColumnName("EventDate");
        });

        modelBuilder.Entity<BookedTicket>(entity =>
        {
            entity.ToTable("Bookedtiket");
            entity.HasKey(e => new { e.BookedTicketId, e.KodeTiket });
            entity.Property(e => e.BookedTicketId).HasColumnName("BookedTicketId");
            entity.Property(e => e.KodeTiket).HasColumnName("KodeTiket");
            entity.Property(e => e.Qty).HasColumnName("Qty");
            entity.Property(e => e.BookingDate).HasColumnName("BookingDate");

            entity.HasOne<Ticket>()
                .WithMany()
                .HasForeignKey(e => e.KodeTiket)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

