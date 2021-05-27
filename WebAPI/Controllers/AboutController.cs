using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        [HttpGet]
        public ActionResult<Tuple<string, string>> GetVersion()
        {
            string version = Assembly.GetExecutingAssembly().GetName().Version.ToString();
            return Ok(Tuple.Create(version, Environment.Version));
        }
    }
}
