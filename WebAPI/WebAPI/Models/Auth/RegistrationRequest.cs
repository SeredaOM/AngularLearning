﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models.Auth
{
    public class RegistrationRequest
    {
        [Required]
        public string IdToken { get; set; }

        [Required]
        public string Nick { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string FirstName{ get; set; }

        [Required]
        public string LastName { get; set; }
    }
}
