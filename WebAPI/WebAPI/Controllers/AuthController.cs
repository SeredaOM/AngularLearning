﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using WebAPI.Models;
using WebAPI.Models.Auth;

namespace WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // https://levelup.gitconnected.com/how-to-sign-in-with-google-in-angular-and-use-jwt-based-net-core-api-authentication-rsa-6635719fb86c

        private readonly ILogger<CustomListItem> _logger;

        private readonly JwtGenerator _jwtGenerator;

        public AuthController(ILogger<CustomListItem> logger, IConfiguration configuration)
        {
            _logger = logger;

            _jwtGenerator = new JwtGenerator(configuration.GetValue<string>("JwtPrivateSigningKey"));
        }

        [Route("register")]
        [HttpPost]
        public ActionResult<AuthenticateResponse> Register([FromBody] RegistrationRequest data)
        {
            AuthenticateResponse response = BL.Auth.Register(_jwtGenerator, data);

            return Ok(response);
        }

        [Route("login")]
        [HttpPost]
        public ActionResult<AuthenticateResponse> Login([FromBody] AuthenticateRequest data)
        {
            AuthenticateResponse response = BL.Auth.Login(_jwtGenerator, data);

            return Ok(response);
        }

        [Route("logout")]
        [HttpPost]
        public ActionResult<AuthenticateResponse> Logout([FromBody] AuthenticateRequest data)
        {
            return Ok(AuthenticateResponse.CreateSuccessfulLogoutResponse());
        }
    }
}
