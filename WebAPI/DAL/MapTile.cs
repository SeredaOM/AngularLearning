using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPI.DAL
{
    public partial class MapTile
    {
        public int Id { get; set; }
        public int MapId { get; set; }
        public short X { get; set; }
        public short Y { get; set; }
        public byte MapTerrainTypeId { get; set; }

        public virtual Map Map { get; set; }
        public virtual MapTerrainType MapTerrainType { get; set; }
    }
}
