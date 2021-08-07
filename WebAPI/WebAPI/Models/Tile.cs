using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace WebAPI.Models
{
    public enum TerrainType
    {
        Invalid = 0,
        Water = 1,
        Desert = 2,
        Swamp = 3,
        Plain = 4,
        Hill = 5,
        Mountain = 6,
        Snow = 7,
    }

    public enum ResourceType
    {
        Invalid,
        Castle,
        Gold,
        Wheet,
    }

    public class Tile
    {
        public Tile() { }

        public Tile(int x, int y, TerrainType terrain, ResourceType? resource)
        {
            X = x;
            Y = y;
            Terrain = terrain;
            Resource = resource;
        }

        #region Public Properties

        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public TerrainType Terrain { get; set; }
        public ResourceType? Resource { get; set; }

        #endregion
    }
}
