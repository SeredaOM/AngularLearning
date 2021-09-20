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
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = GetPayload(jwtGenerator, authRequest.IdToken);
            }
            catch (InvalidJwtException exc)
            {
                return AuthenticateResponse.CreateNotValidTokenResponse(exc.Message);
            }

            using (BrowserWarContext context = BrowserWarContextExtension.GetContext())
            {
                var playerData = context.Players.Where(player => player.Email == payload.Email)
                    .Include(player => player.PlayerRoles)
                    .Select(player => new { Player = player, RoleObject = player.PlayerRoles.SingleOrDefault() })
                    //.Select(player => new { Player = player })
                    .SingleOrDefault();

                if (playerData == null)
                {
                    return AuthenticateResponse.CreateNoPlayerResponse();
                }
                else
                {
                    var tokenString = jwtGenerator.CreateUserAuthToken(null, payload.Email);
                    return AuthenticateResponse.CreateSuccessfulLoginResponse(tokenString, JwtGenerator.ExpiresInMinutes, playerData.RoleObject.Role);
                    //return AuthenticateResponse.CreateSuccessfulLoginResponse(tokenString, JwtGenerator.ExpiresInMinutes, null);
                }
            }
        }

        public static AuthenticateResponse Register(JwtGenerator jwtGenerator, RegistrationRequest registrationRequest)
        {
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = GetPayload(jwtGenerator, registrationRequest.IdToken);
            }
            catch (InvalidJwtException exc)
            {
                return AuthenticateResponse.CreateNotValidTokenResponse(exc.Message);
            }

            using (BrowserWarContext context = BrowserWarContextExtension.GetContext())
            {
                var player = context.Players.Where(player => player.Nick == registrationRequest.Nick || player.Email == registrationRequest.Email).SingleOrDefault();
                if (player == null)
                {
                    context.Players.Add(new DAL.Player() { Email = registrationRequest.Email, Nick = registrationRequest.Nick, FirstName = registrationRequest.FirstName, LastName = registrationRequest.LastName });
                    context.SaveChanges();
                }
                else
                {
                    return AuthenticateResponse.CreateNickOrEmailAreTakenResponse();
                }
            }

            var tokenString = jwtGenerator.CreateUserAuthToken(null, payload.Email);
            return AuthenticateResponse.CreateSuccessfulLoginResponse(tokenString, JwtGenerator.ExpiresInMinutes, null);
        }

        private static GoogleJsonWebSignature.Payload GetPayload(JwtGenerator jwtGenerator, string token)
        {
            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();
            settings.Audience = new List<string>() { GoogleClientId };
            return GoogleJsonWebSignature.ValidateAsync(token, settings).Result;

        }

        private static string GoogleClientId = "706588217519-d997qa9l0iolpgqn22khotv3vtl2v8so.apps.googleusercontent.com";
    }
}
