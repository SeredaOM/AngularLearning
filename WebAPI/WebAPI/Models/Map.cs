using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using WebAPI.DAL;

namespace WebAPI.Models
{
    public class Map
    {
        //  https://www.redblobgames.com/grids/hexagons/

        #region Construction

        public Map(int id, string name, Tile[][] tiles, int yMin, int[] xMins, int[] xWidths)
        {
            Id = id;
            Name = name;

            _yMin = yMin;
            _tiles = (Tile[][])tiles;
            _xMins = xMins;
            _xWidths = xWidths;
        }

        public static IEnumerable<MapDescription> GetMapDataAvailableForPlayer(int playerId)
        {
            List<MapDescription> mapData;

            using (BrowserWarContext context = BrowserWarContextExtension.GetContext())
            {
                mapData = context.Maps
                    .Include(m => m.Owner)
                    .Where(map0 => map0.OwnerId == playerId || map0.Published != 0)
                    .Select(map0 => new MapDescription(map0, map0.Owner.Nick))
                    .ToList();
            }

            return mapData;
        }

        internal static Map FillMapFromData(int mapId, string name, ICollection<DAL.MapTile> tilesData)
        {
            var rowNumbers = tilesData.GroupBy(tile => tile.Y).Select(g => g.Key).ToArray();
            var xMins = new int[rowNumbers.Length];
            var xWidths = new int[rowNumbers.Length];
            Tile[][] tiles = new Tile[rowNumbers.Length][];

            var minY = rowNumbers.Length == 0 ? 0 : rowNumbers.Min();
            foreach (var y in rowNumbers)
            {
                var rowTiles = tilesData.Where(tile0 => tile0.Y == y).ToList();

                var xMin = rowTiles.Min(tile => tile.X);
                var xWidth = rowTiles.Max(tile => tile.X) - xMin + 1;
                xMins[y - minY] = xMin;
                xWidths[y - minY] = xWidth;

                Tile[] tilesRow = new Tile[xWidth];
                tiles[y - minY] = tilesRow;

                foreach (var tileData in rowTiles)
                {
                    ResourceType? rt = tileData.MapResourceTypeId == null ? null : (ResourceType)tileData.MapResourceTypeId;
                    Tile tile = new Tile(tileData.X, tileData.Y, (TerrainType)tileData.MapTerrainTypeId, rt);
                    tilesRow[tileData.X - xMin] = tile;
                }
            }

            var map = new Map(mapId, name, tiles, minY, xMins, xWidths);

            return map;
        }

        public static void SaveMapTiles(int mapId, List<Tile> tiles)
        {
            using (BrowserWarContext context = BrowserWarContextExtension.GetContext())
            {
                List<MapTile> dbTiles = context.MapTiles.Where(tile => tile.MapId == mapId).ToList();
                foreach (var tile in tiles)
                {
                    var dbTile = dbTiles.Where(t => t.X == tile.X && t.Y == tile.Y).SingleOrDefault();
                    if (dbTile == null)
                    {
                        if (tile.Terrain != TerrainType.Invalid)
                        {
                            dbTile = new MapTile() { MapId = mapId, X = (short)tile.X, Y = (short)tile.Y, MapTerrainTypeId = (byte)tile.Terrain };
                            context.MapTiles.Add(dbTile);
                        }
                    }
                    else
                    {
                        if (tile.Terrain == TerrainType.Invalid)
                        {
                            context.MapTiles.Remove(dbTile);
                        }
                        else
                        {
                            dbTile.MapTerrainTypeId = (byte)tile.Terrain;
                        }
                    }
                }
                context.SaveChanges();
            }
        }

        public static Map GetMap(int mapId)
        {
            Map map;

            string myConnectionString = ConfigurationManager.ConnectionStrings[0].ConnectionString;
            using (BrowserWarContext context = new BrowserWarContext())
            {
                var mapData = context.Maps
                    .Include(m => m.MapTiles)
                    .Where(map0 => map0.Id == mapId)
                    .FirstOrDefault();

                if (mapData == null)
                {
                    map = null;
                }
                else
                {
                    map = FillMapFromData(mapId, mapData.Name, mapData.MapTiles);
                }
            }

            return map;
        }

        public static Map CreateRoundMap(int radius)
        {
            int diameter = 1 + 2 * radius;

            Tile[][] tiles = new Tile[diameter][];
            int[] xMins = new int[diameter];
            int[] xWidths = new int[diameter];
            for (int y = -radius; y <= radius; y++)
            {
                int xMin = Math.Max(-radius, -(y + radius));
                int xWidth = 2 * radius - Math.Abs(y);
                int xMax = xMin + xWidth;
                string log = $"Line y={y}, width={xWidth}:";

                Tile[] raw = new Tile[xWidth + 1];
                for (int x = xMin; x <= xMax; x++)
                {
                    TerrainType terrain;
                    ResourceType? resource = null;
                    if (x == 0 && y == 0)
                    {
                        terrain = TerrainType.Plain;
                        resource = ResourceType.Settlement;
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

            return new Map(0, "New round map", tiles, -radius, xMins, xWidths);
        }

        #endregion

        #region Public Methods

        public Tile GetTile(int x, int y)
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

        public int YMin { get { return _yMin; } }

        public int[] XMins { get { return _xMins; } }

        public int[] XWidths { get { return _xWidths; } }

        public Tile[][] Tiles { get { return _tiles; } }

        #endregion

        #region Private members

        private readonly int _yMin;
        private readonly int[] _xMins;
        private readonly int[] _xWidths;
        private readonly Tile[][] _tiles;

        #endregion
    }
}
