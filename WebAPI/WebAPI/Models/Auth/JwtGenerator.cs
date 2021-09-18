using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace WebAPI.Models
{
    public class JwtGenerator
    {
        public const int ExpiresInMinutes = 7 * 24 * 60;    //  1 week

        readonly RsaSecurityKey _key;
        public JwtGenerator(string signingKey)
        {
            RSA privateRSA = RSA.Create();
            privateRSA.ImportRSAPrivateKey(Convert.FromBase64String(signingKey), out _);
            _key = new RsaSecurityKey(privateRSA);
        }

        public string CreateUserAuthToken(IConfiguration configuration, string userId)
        {
            var authClaims = new Dictionary<string, object>();
            authClaims.Add(JwtRegisteredClaimNames.Sub, userId);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = "myApi",
                Issuer = "AuthService",
                Claims = authClaims,
                Expires = DateTime.UtcNow.AddMinutes(ExpiresInMinutes),
                SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.RsaSha256)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
    }
}
