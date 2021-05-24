using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MapId { get; set; }
        public byte Explored { get; set; }

        public virtual Map Map { get; set; }
    }
}
