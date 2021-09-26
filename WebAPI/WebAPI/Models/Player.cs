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

        #region Construction

        public Player(DAL.Player player, string role) : this(player.Id, player.Nick, player.Email, player.FirstName, player.LastName, role) { }

        public Player(int id, string nick, string email, string firstName, string lastName, string role)
        {
            Id = id;
            Nick = nick;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            Role = role;
        }

        #endregion

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

        public int Id { get; private set; }

        public string Nick { get; private set; }

        public string Email { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public string Role { get; private set; }
    }
}
