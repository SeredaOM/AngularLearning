using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class Player
    {
        public int Id { get; set; }
        public string Nick { get; set; }
        public string Email { get; set; }
        public DateTime RegistrationDate { get; set; }
    }
}
