using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.DAL;

namespace WebAPI.Models
{
    public class Player
    {
        public static int GetPlayerIdByEmail(string email)
        {
            using (BrowserWarContext context = BrowserWarContextExtension.GetContext())
            {
                var player = context.Players.Where(player => player.Email == email).SingleOrDefault();
                return player == null ? 0 : player.Id;
            }
        }
    }
}
