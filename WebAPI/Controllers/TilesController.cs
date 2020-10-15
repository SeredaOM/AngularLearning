using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TilesController : ControllerBase
    {
        private readonly TodoContext _context;

        public TilesController(TodoContext context)
        {
            _context = context;
        }

        // GET: Tiles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tile>>> GetTodoItems()
        {
            return await _context.TodoItems.ToListAsync();
        }

        // GET: Tiles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tile>> GetTile(int id)
        {
            if (id==1)
            {
                return Ok(new Tile(1, 1, TerrainType.Hill, null));
            }

            var tile = await _context.TodoItems.FindAsync(id);

            if (tile == null)
            {
                return NotFound();
            }

            return tile;
        }

        // PUT: Tiles/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTile(int id, Tile tile)
        {
            if (id != tile.Id)
            {
                return BadRequest();
            }

            _context.Entry(tile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TileExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: Tiles
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Tile>> PostTile(Tile tile)
        {
            _context.TodoItems.Add(tile);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTile", new { id = tile.Id }, tile);
        }

        // DELETE: Tiles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Tile>> DeleteTile(int id)
        {
            var tile = await _context.TodoItems.FindAsync(id);
            if (tile == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(tile);
            await _context.SaveChangesAsync();

            return tile;
        }

        private bool TileExists(int id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }
    }
}
