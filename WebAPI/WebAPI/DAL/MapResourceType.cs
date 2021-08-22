using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class MapResourceType
    {
        public MapResourceType()
        {
            MapTiles = new HashSet<MapTile>();
        }

        public short Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<MapTile> MapTiles { get; set; }
    }
}
