using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.DAL;

namespace WebAPI.Models.Auth
{
    public class AuthenticateResponse
    {
        public AuthenticateResponse(string authToken, int expiresInMinutes, PlayerRole playerRole)
        {
            AuthToken = authToken;
            ExpiresInMinutes = expiresInMinutes;
            Role = playerRole.Role;
        }

        public string AuthToken{get;private set; }

        public int ExpiresInMinutes { get; private set; }

        public string Role { get; private set; }
    }
}
