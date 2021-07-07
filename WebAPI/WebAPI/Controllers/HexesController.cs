using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using Microsoft.Extensions.Logging;

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

        [HttpGet("mapsForPlayer/{playerId:int}")]
        public ActionResult<IEnumerable<IMapDescription>> GetMapDataAvailableForPlayer(int playerId)
        {
            if (playerId <= 0)
            {
                return NotFound();
            }

            var mapData = Map.GetMapDataAvailableForPlayer(playerId);
            return Ok(mapData);
        }

        [HttpGet("map/{mapId:int}")]
        public ActionResult<IMap> GetMap(int mapId)
        {
            if (mapId <= 0)
            {
                return NotFound();
            }

            IMap map = Map.GetMap(mapId);
            return Ok(map);
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
