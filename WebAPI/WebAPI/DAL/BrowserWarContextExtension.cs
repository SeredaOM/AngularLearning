using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace WebAPI.DAL
{
    public static class BrowserWarContextExtension
    {
        public static BrowserWarContext GetContext()
        {
            string myConnectionString = ConfigurationManager.ConnectionStrings[0].ConnectionString;
            return new BrowserWarContext();
        }

        public static void EnsureBasicDataCreated(this BrowserWarContext context)
        {
            var mtts = new[]{
                new MapTerrainType { Id = 1, Name = "Water" },
                new MapTerrainType { Id = 2, Name = "Desert" },
                new MapTerrainType { Id = 3, Name = "Swamp" },
                new MapTerrainType { Id = 4, Name = "Plain" },
                new MapTerrainType { Id = 5, Name = "Hill" },
                new MapTerrainType { Id = 6, Name = "Mountain" },
                new MapTerrainType { Id = 7, Name = "Snow" },
                };
            var dbIds = context.MapTerrainTypes.Select(mtt => mtt.Id).ToArray();
            var mttsToInsert = mtts.Where(mtt => !dbIds.Contains(mtt.Id)).ToArray();
            context.AddRange(mttsToInsert);
            context.SaveChanges();
        }
    }
}
