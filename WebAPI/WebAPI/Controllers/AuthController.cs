using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.JsonWebTokens;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // https://levelup.gitconnected.com/how-to-sign-in-with-google-in-angular-and-use-jwt-based-net-core-api-authentication-rsa-6635719fb86c
        public class AuthenticateRequest
        {
            [Required]
            public string IdToken { get; set; }
        }

        private readonly ILogger<CustomListItem> _logger;

        private readonly JwtGenerator _jwtGenerator;

        public AuthController(ILogger<CustomListItem> logger, IConfiguration configuration)
        {
            _logger = logger;

            _jwtGenerator = new JwtGenerator(configuration.GetValue<string>("JwtPrivateSigningKey"));
        }

        [Route("login")]
        [HttpPost]
        public ActionResult<string> Login([FromBody] AuthenticateRequest data)
        {
            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();

            // Change this to your google client ID
            settings.Audience = new List<string>() { "706588217519-d997qa9l0iolpgqn22khotv3vtl2v8so.apps.googleusercontent.com" };

            GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(data.IdToken, settings).Result;

            var tokenString = _jwtGenerator.CreateUserAuthToken(null, payload.Email);
            return Ok(new { AuthToken = tokenString, ExpiresInMinutes = JwtGenerator.ExpiresInMinutes });
        }

        [Route("logout")]
        [HttpPost]
        public ActionResult Logout([FromBody] AuthenticateRequest data)
        {
            throw new NotImplementedException("Does this method need to do something?");
            //return Ok();
        }
    }
}
