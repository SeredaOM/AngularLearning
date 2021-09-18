using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class PlayerRole
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public string Role { get; set; }

        public virtual Player Player { get; set; }
    }
}
