using Emergency_Services_Locator.Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;

namespace Emergency_Services_Locator.Backend
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { 
            
        }

        public DbSet<Facility> Facilities { get; set; }
        public DbSet<Map> Maps { get; set; }

        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<Facility>().HasQueryFilter(c => !c.is_deleted);
            mb.Entity<Map>().HasQueryFilter(c => !c.is_deleted);
        }
    }
}
