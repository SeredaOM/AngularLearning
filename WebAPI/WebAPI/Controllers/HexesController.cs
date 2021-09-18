using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HexesController : ControllerBase
    {
        private readonly ILogger<CustomListItem> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HexesController(ILogger<CustomListItem> logger, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        private int GetSessionPlayerId()
        {
            var emailClaim = _httpContextAccessor.HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
            int playerId = emailClaim == null ? 0 : Player.GetPlayerIdByEmail(emailClaim.Value);
            return playerId;
        }

        [Authorize]
        [Route("mapsForPlayer")]
        [HttpGet]
        public ActionResult<IEnumerable<MapDescription>> GetMapDataAvailableForPlayer()
        {
            int playerId = GetSessionPlayerId();
            if (playerId <= 0)
            {
                return NotFound("Can't find current player Id");
            }

            var mapData = Map.GetMapDataAvailableForPlayer(playerId);
            return Ok(mapData);
        }

        [Authorize]
        [Route("map/{mapId:int}")]
        [HttpGet]
        public ActionResult<Map> GetMap(int mapId)
        {
            if (mapId <= 0)
            {
                return NotFound("Map is not found");
            }

            Map map = Map.GetMap(mapId);
            if (map == null)
            {
                return NotFound("Map is not found");
            }

            return Ok(map);
        }

        [Authorize]
        [HttpPost]
        [Route("SaveMapChanges/{mapId:int}/{mapName}")]
        public ActionResult<int> SaveMapChanges(int mapId, string mapName, [FromBody] Tile[] mapTiles)
        {
            ActionResult<int> res;
            try
            {
                int playerId = GetSessionPlayerId();
                if (playerId <= 0)
                {
                    return NotFound("Can't find current player Id");
                }
                int mapOwnerId = Map.GetMapOwnerId(mapId); 
                if (mapOwnerId != playerId)
                {
                    return ValidationProblem("Map belongs to another owner");
                }                

                Map.SaveMapChanges(mapId, mapName, mapTiles);
                res = Ok(mapId);
            }
            catch (Exception e)
            {
                string error = string.Format("Error: {0}\nInnerException: {1}", e.Message, e.InnerException == null ? "" : e.InnerException.Message);
                _logger.LogError(error);
                string errorForClient = string.Format("Can't handle 'SaveMapTiles' request for mapId={0}, name={1}, # of tiles={2}", mapId, mapName, mapTiles.Length);
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
