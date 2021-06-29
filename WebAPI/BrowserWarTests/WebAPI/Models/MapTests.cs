using NUnit.Framework;
using WebAPI.Models;

namespace BrowserWarTests
{
    public class MapTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void FillMapFromData_EnsureTileWithNegativeCoordinatesArePutToMap()
        {
            var name = "Map1";
            var tilesData = new[]
            {
                new WebAPI.DAL.MapTile{ X = -2, Y = -1, MapTerrainTypeId = (byte)TerrainType.Plain },
                new WebAPI.DAL.MapTile{ X = -1, Y = -1, MapTerrainTypeId = (byte)TerrainType.Plain },
                new WebAPI.DAL.MapTile{ X = 0, Y = -1, MapTerrainTypeId = (byte)TerrainType.Plain },
                new WebAPI.DAL.MapTile{ X = 0, Y = 0, MapTerrainTypeId = (byte)TerrainType.Mountain },
                new WebAPI.DAL.MapTile{ X = 0, Y = 1, MapTerrainTypeId = (byte)TerrainType.Plain },
                new WebAPI.DAL.MapTile{ X = 1, Y = 1, MapTerrainTypeId = (byte)TerrainType.Plain },
                new WebAPI.DAL.MapTile{ X = 2, Y = 0, MapTerrainTypeId = (byte)TerrainType.Desert },
            };

            var map = Map.FillMapFromData(name, tilesData);

            Assert.AreEqual(name, map.Name);

            Assert.AreEqual(3, map.XMins.Length);
            Assert.AreEqual(-2, map.XMins[0]);
            Assert.AreEqual(3, map.XWidths[1]);

            var tileTest = map.GetTile(-2, -1);
            Assert.AreEqual(-2, tileTest.X);
            Assert.AreEqual(-1, tileTest.Y);
            Assert.AreEqual(TerrainType.Plain, tileTest.Terrain);

            tileTest = map.GetTile(-1, -1);
            Assert.AreEqual(-1, tileTest.X);
            Assert.AreEqual(-1, tileTest.Y);

            tileTest = map.GetTile(0, -1);
            Assert.AreEqual(0, tileTest.X);
            Assert.AreEqual(-1, tileTest.Y);

            tileTest = map.GetTile(0, 0);
            Assert.AreEqual(0, tileTest.X);
            Assert.AreEqual(0, tileTest.Y);
            Assert.AreEqual(TerrainType.Mountain, tileTest.Terrain);

            tileTest = map.GetTile(2, 0);
            Assert.AreEqual(2, tileTest.X);
            Assert.AreEqual(0, tileTest.Y);
            Assert.AreEqual(TerrainType.Desert, tileTest.Terrain);
        }

        [Test]
        public void FillMapFromData_EnsureTileWithPositiveYCoordinateHasCorrectYMin()
        {
            var tilesData = new[]
            {
                new WebAPI.DAL.MapTile{ X = 1, Y = 1, MapTerrainTypeId = (byte)TerrainType.Plain },
                new WebAPI.DAL.MapTile{ X = 1, Y = 2, MapTerrainTypeId = (byte)TerrainType.Plain },
            };

            var map = Map.FillMapFromData("Map1", tilesData);

            Assert.AreEqual(1, map.YMin);
            Assert.AreEqual(2, map.XMins.Length);
            Assert.AreEqual(1, map.XMins[0]);
            Assert.AreEqual(1, map.XWidths[0]);

            ITile tileTest;

            tileTest = map.GetTile(1, 1);
            Assert.AreEqual(1, tileTest.X);
            Assert.AreEqual(1, tileTest.Y);

            tileTest = map.GetTile(1, 2);
            Assert.AreEqual(1, tileTest.X);
            Assert.AreEqual(2, tileTest.Y);
        }

        [Test]
        public void FillMapFromData_ShouldNotCrashForEmptyMap()
        {
            WebAPI.DAL.MapTile[] tilesData = System.Array.Empty<WebAPI.DAL.MapTile>();

            var map = Map.FillMapFromData("Map1", tilesData);
            Assert.AreEqual(0, map.YMin);
            Assert.AreEqual(0, map.XMins.Length);
            Assert.AreEqual(0, map.XWidths.Length);
        }
    }
}
