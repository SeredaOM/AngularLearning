using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models.Auth
{
    public class AuthenticateRequest
    {
        [Required]
        public string IdToken { get; set; }
    }
}
