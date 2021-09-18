using Google.Apis.Auth;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using WebAPI.DAL;
using WebAPI.Models;
using WebAPI.Models.Auth;

namespace WebAPI.BL
{
    public class Auth
    {
        public static AuthenticateResponse Login(JwtGenerator jwtGenerator, AuthenticateRequest authRequest)
        {

            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();

            // Google client ID
            settings.Audience = new List<string>() { "706588217519-d997qa9l0iolpgqn22khotv3vtl2v8so.apps.googleusercontent.com" };

            GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(authRequest.IdToken, settings).Result;

            using (BrowserWarContext context = BrowserWarContextExtension.GetContext())
            {
                var playerData = context.Players.Where(player => player.Email == payload.Email)
                    .Include(player => player.PlayerRoles)
                    .Select(player => new { Player = player, Role = player.PlayerRoles.SingleOrDefault() })
                    .SingleOrDefault();

                if (playerData == null)
                {
                    throw new System.NotImplementedException("Need to handle 'unknown' user");
                }
                else
                {
                    var tokenString = jwtGenerator.CreateUserAuthToken(null, payload.Email);

                    return new AuthenticateResponse(tokenString, JwtGenerator.ExpiresInMinutes, playerData.Role);
                }
            }
        }
    }
}
