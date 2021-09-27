namespace WebAPI.Models.Auth
{
    public class AuthenticateResponse
    {
        public static AuthenticateResponse CreateSuccessfulLoginResponse(string authToken, int expiresInMinutes, Player player)
        {
            return new AuthenticateResponse(0, null, authToken, expiresInMinutes, player);
        }

        public static AuthenticateResponse CreateSuccessfulLogoutResponse()
        {
            return new AuthenticateResponse(0, null, null, 0, null);
        }

        internal static AuthenticateResponse CreateNotValidTokenResponse(string errorMessage)
        {
            return new AuthenticateResponse(1, errorMessage);
        }

        internal static AuthenticateResponse CreateNoPlayerResponse()
        {
            return new AuthenticateResponse(2, null);
        }

        internal static AuthenticateResponse CreateNickOrEmailAreTakenResponse()
        {
            return new AuthenticateResponse(3, null);
        }

        internal static AuthenticateResponse CreateInvalidRegistrationDataResponse(string error)
        {
            return new AuthenticateResponse(4, error);
        }

        private AuthenticateResponse(int resultCode, string resultMessage) : this(resultCode, resultMessage, null, 0, null)
        {
        }

        private AuthenticateResponse(int resultCode, string resultMessage, string authToken, int expiresInMinutes, Player player)
        {
            ResultCode = resultCode;
            ResultMessage = resultMessage;
            AuthToken = authToken;
            ExpiresInMinutes = expiresInMinutes;
            Player = player;
        }

        public int ResultCode { get; private set; }

        public string ResultMessage { get; private set; }

        public string AuthToken { get; private set; }

        public int ExpiresInMinutes { get; private set; }

        public Player Player { get; private set; }
    }
}
