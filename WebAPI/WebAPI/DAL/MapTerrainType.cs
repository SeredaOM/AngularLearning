using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class MapTerrainType
    {
        public MapTerrainType()
        {
            MapTiles = new HashSet<MapTile>();
        }

        public byte Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<MapTile> MapTiles { get; set; }
    }
}
