using System;
using System.Configuration;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using WebAPI.DAL;

namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //ValidateConnectionToDB();

            CreateHostBuilder(args).Build().Run();
        }

#pragma warning disable IDE0051 // Remove unused private members
        private static void ValidateConnectionToDB()
#pragma warning restore IDE0051 // Remove unused private members
        {
            string myConnectionString = ConfigurationManager.ConnectionStrings[0].ConnectionString;
            using (BrowserWarContext context = new BrowserWarContext())
            {
                //  Creating a Database with Code First in EF Core
                //  https://dev.mysql.com/doc/connector-net/en/connector-net-entityframework-core-example.html
                context.Database.EnsureCreated();

                var game = context.Games.Where(game => game.Id == 1).First();
                Console.WriteLine(game.Name);

                var map = context.Maps.Where(map => map.Id == game.Id).First();
                Console.WriteLine(map.Name);
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
