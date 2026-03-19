using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAsync(ApplicationDbContext context, ILogger logger)
        {
            try
            {
                // Assign roles to specific accounts safely, without raw SQL
                var adminUser = await context.Clients.FirstOrDefaultAsync(c => c.Email == "lauti@gmail.com");
                if (adminUser != null && adminUser.Role != "admin")
                {
                    adminUser.Role = "admin";
                    logger.LogInformation("Role 'admin' assigned to lauti@gmail.com");
                }

                var superAdminUser = await context.Clients.FirstOrDefaultAsync(c => c.Email == "membranasechesortu@gmail.com");
                if (superAdminUser != null && superAdminUser.Role != "superadmin")
                {
                    superAdminUser.Role = "superadmin";
                    logger.LogInformation("Role 'superadmin' assigned to membranasechesortu@gmail.com");
                }

                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding roles in the database.");
            }
        }
    }
}
