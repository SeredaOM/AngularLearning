namespace WebAPI.Models.Auth
{
    public class AuthenticateResponse
    {
        public static AuthenticateResponse CreateSuccessfulLoginResponse(string authToken, int expiresInMinutes, string role)
        {
            return new AuthenticateResponse(0, null, authToken, expiresInMinutes, role);
        }

        internal static AuthenticateResponse CreateNotValidTokenResponse(string errorMessage)
        {
            return new AuthenticateResponse(1, errorMessage, null, 0, null);
        }

        internal static AuthenticateResponse CreateNoPlayerResponse()
        {
            return new AuthenticateResponse(2, null, null, 0, null);
        }

        internal static AuthenticateResponse CreateNickOrEmailAreTakenResponse()
        {
            return new AuthenticateResponse(3, null, null, 0, null);
        }
        
        private AuthenticateResponse(int resultCode, string resultMessage, string authToken, int expiresInMinutes, string role)
        {
            ResultCode = resultCode;
            ResultMessage = resultMessage;
            AuthToken = authToken;
            ExpiresInMinutes = expiresInMinutes;
            Role = role;
        }

        public int ResultCode { get; private set; }

        public string ResultMessage { get; private set; }

        public string AuthToken { get; private set; }

        public int ExpiresInMinutes { get; private set; }

        public string Role { get; private set; }
    }
}
