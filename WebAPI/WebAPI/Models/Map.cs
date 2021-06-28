using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using WebAPI.DAL;

namespace WebAPI.Models
{
    public interface IMap
    {
        string Name { get; }
        int Radius { get; }
        ITile[][] Tiles { get; }
        int[] XMins { get; }
        int[] XWidths { get; }

        ITile GetTile(int x, int y);
    }

    public class Map : IMap
    {
        //  https://www.redblobgames.com/grids/hexagons/

        #region Construction

        public Map(string name, ITile[][] tiles, int yMin, int[] xMins, int[] xWidths)
        {
            Name = name;

            _yMin = yMin;
            _tiles = tiles;
            _xMins = xMins;
            _xWidths = xWidths;
        }

        internal static IMap FillMapFromData(string name, ICollection<DAL.MapTile> tilesData)
        {
            var rowNumbers = tilesData.GroupBy(tile => tile.Y).Select(g => g.Key).ToArray();
            var xMins = new int[rowNumbers.Length];
            var xWidths = new int[rowNumbers.Length];
            ITile[][] tiles = new ITile[rowNumbers.Length][];

            var minY = rowNumbers.Length == 0 ? 0 : rowNumbers.Min();
            foreach (var y in rowNumbers)
            {
                var rowTiles = tilesData.Where(tile0 => tile0.Y == y).ToList();

                var xMin = rowTiles.Min(tile => tile.X);
                var xWidth = rowTiles.Max(tile => tile.X) - xMin + 1;
                xMins[y - minY] = xMin;
                xWidths[y - minY] = xWidth;

                var tilesRow = new ITile[xWidth];
                tiles[y - minY] = tilesRow;

                foreach (var tileData in rowTiles)
                {
                    ITile tile = new Tile(tileData.X, tileData.Y, (TerrainType)tileData.MapTerrainTypeId, null);
                    tilesRow[tileData.X - xMin] = tile;
                }
            }

            var map = new Map(name, tiles, minY, xMins, xWidths);

            return map;
        }

        public static IMap GetMap(int mapId)
        {
            IMap map;

            string myConnectionString = ConfigurationManager.ConnectionStrings[0].ConnectionString;
            using (BrowserWarContext context = new BrowserWarContext())
            {
                var mapData = context.Maps.Where(map0 => map0.Id == mapId).FirstOrDefault();

                if (mapData == null)
                {
                    map = null;
                }
                else
                {
                    map = FillMapFromData(mapData.Name, mapData.MapTiles);
                }
            }

            return map;
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

            return new Map("New round map", tiles, -radius, xMins, xWidths);
        }

        #endregion

        #region Public Methods

        public ITile GetTile(int x, int y)
        {
            var yIndex = y - _yMin;
            if (yIndex < 0 || yIndex > XMins.Length)
            {
                throw new Exception(string.Format("Y coordinate ({0}) is out of bounds", yIndex));
            }
            var xIndex = x - _xMins[yIndex];
            if (xIndex >= _xWidths[yIndex])
            {
                throw new Exception(string.Format("X coordinate ({0}) is out of bounds", xIndex));
            }

            return _tiles[yIndex][xIndex];
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
        private readonly int _yMin;
        private readonly int[] _xMins;
        private readonly int[] _xWidths;

        #endregion
    }
}
