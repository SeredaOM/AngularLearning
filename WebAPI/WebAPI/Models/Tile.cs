﻿using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace WebAPI.Models
{
    public enum TerrainType
    {
        Invalid,
        Water,
        Desert,
        Swamp,
        Plain,
        Hill,
        Mountain,
        Snow,
    }

    public enum ResourceType
    {
        Invalid,
        Castle,
        Gold,
        Wheet,
    }

    public interface ITile
    {
        public int X { get; }

        public int Y { get; }

        public TerrainType Terrain { get; }

        public ResourceType? Resource { get; }
    }

    public class Tile : ITile
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
