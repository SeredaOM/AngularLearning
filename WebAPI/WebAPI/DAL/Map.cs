using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class Map
    {
        public Map()
        {
            Games = new HashSet<Game>();
            MapTiles = new HashSet<MapTile>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Game> Games { get; set; }
        public virtual ICollection<MapTile> MapTiles { get; set; }
    }
}
