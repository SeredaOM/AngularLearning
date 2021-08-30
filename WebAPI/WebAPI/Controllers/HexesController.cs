using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HexesController : ControllerBase
    {
        private readonly ILogger<CustomListItem> _logger;

        public HexesController(ILogger<CustomListItem> logger)
        {
            _logger = logger;
        }

        [Route("mapsForPlayer/{playerId:int}")]
        [HttpGet]
        public ActionResult<IEnumerable<MapDescription>> GetMapDataAvailableForPlayer(int playerId)
        {
            if (playerId <= 0)
            {
                return NotFound();
            }

            var mapData = Map.GetMapDataAvailableForPlayer(playerId);
            return Ok(mapData);
        }

        [Route("map/{mapId:int}")]
        [HttpGet]
        public ActionResult<Map> GetMap(int mapId)
        {
            if (mapId <= 0)
            {
                return NotFound();
            }

            Map map = Map.GetMap(mapId);
            if (map == null)
            {
                return NotFound();
            }

            return Ok(map);
        }

        [Route("maptiles/{mapId:int}")]
        [HttpPost]
        public ActionResult<int> SaveMapTiles(int mapId, Map map)
        {
            ActionResult<int> res;
            try
            {
                Map.SaveMap(mapId, map.Name, map.Tiles[0]);
                res = Ok(mapId);
            }
            catch (Exception e)
            {
                string error = string.Format("Error: {0}\nInnerException: {1}", e.Message, e.InnerException == null ? "" : e.InnerException.Message);
                _logger.LogError(error);
                string errorForClient = string.Format("Can't handle 'SaveMapTiles' request for mapId={0}, name={1}, # of tiles={2}", mapId, map.Name, map.Tiles[0].Length);
                return Problem(errorForClient, null, 501);
            }
            return res;
        }

        [HttpPost]
        public ActionResult<int> PostTile(Tile tile)
        {
            //  return some value from the incoming object to allow testing/debugging
            //return CreatedAtAction()
            return Ok(tile.Y + (tile.Resource == ResourceType.Gold ? 10 : 0));
        }
    }
}
