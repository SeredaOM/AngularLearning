using Google.Apis.Auth;
using System;
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
                    string role = playerData.RoleObject == null ? null : playerData.RoleObject.Role;
                    Models.Player player = new Models.Player(playerData.Player, role);
                    return AuthenticateResponse.CreateSuccessfulLoginResponse(tokenString, JwtGenerator.ExpiresInMinutes, player);
                }
            }
        }

        public static AuthenticateResponse Register(JwtGenerator jwtGenerator, RegistrationRequest registrationRequest)
        {
            if (!Models.Player.IsNickValid(registrationRequest.Nick))
            {
                return AuthenticateResponse.CreateInvalidRegistrationDataResponse("Nick name is not valid");
            }

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
                DAL.Player playerData = context.Players.Where(player => player.Nick == registrationRequest.Nick || player.Email == registrationRequest.Email).SingleOrDefault();
                if (playerData != null)
                {
                    return AuthenticateResponse.CreateNickOrEmailAreTakenResponse();
                }

                playerData = new DAL.Player()
                {
                    Nick = registrationRequest.Nick,
                    Email = payload.Email,
                    RegistrationDate = DateTime.Now,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName
                };
                context.Players.Add(playerData);
                context.SaveChanges();

                var tokenString = jwtGenerator.CreateUserAuthToken(null, payload.Email);
                Models.Player player = new Models.Player(playerData, null);
                return AuthenticateResponse.CreateSuccessfulLoginResponse(tokenString, JwtGenerator.ExpiresInMinutes, player);
            }
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
