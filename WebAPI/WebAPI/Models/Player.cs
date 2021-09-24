using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebAPI.DAL;
using WebAPI.Models.Auth;

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

        internal static bool IsNickValid(string nick)
        {
            if (nick.Length < 4 || nick.Length > 15)
            {
                return false;
            }

            if (!Regex.IsMatch(nick, @"^[a-zA-Z].[a-zA-Z0-9]+$"))
            {
                return false;
            }

            return true;
        }
    }
}
