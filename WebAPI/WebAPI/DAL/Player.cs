using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class Player
    {
        public Player()
        {
            Maps = new HashSet<Map>();
            PlayerRoles = new HashSet<PlayerRole>();
        }

        public int Id { get; set; }
        public string Nick { get; set; }
        public string Email { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual ICollection<Map> Maps { get; set; }
        public virtual ICollection<PlayerRole> PlayerRoles { get; set; }
    }
}
