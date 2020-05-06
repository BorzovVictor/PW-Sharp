using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PW.Core;
using PW.Core.Entities;

namespace PW.Infrastructure
{
    public interface IPwSeeder
    {
        void Initialize(IServiceProvider serviceProvider);
    }
    public class PwSeeder: IPwSeeder
    {
        private readonly AppSettings _appSettings;
        private readonly ISetStartBalanceCase _setStartBalance;
        
        public PwSeeder(IOptions<AppSettings> appSettings, ISetStartBalanceCase setStartBalance)
        {
            _setStartBalance = setStartBalance;
            _appSettings = appSettings.Value;
        }

        public void Initialize(IServiceProvider serviceProvider)
        {
            using (var dbContext =
                new AppDbContext(serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>()))
            {
                // Look for any Users items.
                if (dbContext.Users.Any())
                {
                    return; // DB has been seeded
                }

                PopulateTestData(dbContext);
            }
        }

        private void PopulateTestData(AppDbContext dbContext)
        {
            foreach (var item in dbContext.Users)
            {
                dbContext.Remove(item);
            }

            dbContext.SaveChanges();
            
            var user = new User()
            {
                Name = "Admin",
                Email = "admin@pw.com",
                Password = "Password"
            };
            dbContext.Users.Add(user);
            dbContext.SaveChanges();
            
            _setStartBalance.Execute(user.Id, _appSettings.StartBalance);
        }
    }
}