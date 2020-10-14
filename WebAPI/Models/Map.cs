using System;

namespace WebAPI.Models
{
    public interface IMap
    {
        string Name { get; }
        int Radius { get; }
        ITile[][] Tiles { get; }
        int[] XMins { get; }
        int[] XWidths { get; }
    }

    public class Map : IMap
    {
        //  https://www.redblobgames.com/grids/hexagons/

        #region Construction

        public Map(string name, int radius, ITile[][] tiles, int[] xMins, int[] xWidths)
        {
            Name = name;

            _radius = radius;
            _tiles = tiles;
            _xMins = xMins;
            _xWidths = xWidths;
        }

        public static Map CreateRoundMap(int radius)
        {
            int diameter = 1 + 2 * radius;

            ITile[][] tiles = new ITile[diameter][];
            int[] xMins = new int[diameter];
            int[] xWidths = new int[diameter];
            for (int y = -radius; y <= radius; y++)
            {
                int xMin = Math.Max(-radius, -(y + radius));
                int xWidth = 2 * radius - Math.Abs(y);
                int xMax = xMin + xWidth;
                string log = $"Line y={y}, width={xWidth}:";

                ITile[] raw = new Tile[xWidth + 1];
                for (int x = xMin; x <= xMax; x++)
                {
                    TerrainType terrain;
                    ResourceType? resource = null;
                    if (x == 0 && y == 0)
                    {
                        terrain = TerrainType.Plain;
                        resource = ResourceType.Castle;
                    }
                    else if (x == -radius || y == -radius || x + y == -radius || x == radius || y == radius || x + y == radius)
                    {
                        terrain = TerrainType.Mountain;
                    }
                    else
                    {
                        terrain = TerrainType.Snow;
                    }

                    log += $" (${x},{y}: {terrain})";
                    raw[x - xMin] = new Tile(x, y, terrain, resource);
                }

                // console.log(log);
                tiles[y + radius] = raw;
                xMins[y + radius] = xMin;
                xWidths[y + radius] = xWidth;
            }

            return new Map("New round map", radius, tiles, xMins, xWidths);
        }

        #endregion

        #region Public Properties

        public int Id { get; set; }

        public string Name { get; set; }

        public int Radius { get { return _radius; } }

        public ITile[][] Tiles { get { return _tiles; } }

        public int[] XMins { get { return _xMins; } }

        public int[] XWidths { get { return _xWidths; } }

        #endregion

        #region Private members

        private int _radius;
        private readonly ITile[][] _tiles;
        private readonly int[] _xMins;
        private readonly int[] _xWidths;

        #endregion
    }
}
