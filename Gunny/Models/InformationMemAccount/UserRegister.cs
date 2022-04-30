using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gunny.Models.InformationMemAccount
{
    public class UserRegister
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Password2 { get; set; }
        public string  ConfirmPassword { get; set; }
    }
}
