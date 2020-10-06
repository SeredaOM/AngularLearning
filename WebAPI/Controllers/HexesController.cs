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

        [HttpGet]
        public IEnumerable<CustomListItem> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new CustomListItem
            {
                Id = index,
                Text = string.Format("Text #{0}", index),
                Description = "Hello EVERYONE!!!"
            })
            .ToArray();
        }
    }
}
