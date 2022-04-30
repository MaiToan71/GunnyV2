using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gunny.Models.ChangePassword
{
    public class ChangePassword
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
      
        public string OldPassword { get; set; }
        public string ConfirmPassword { get; set; }

        public string Password2 { get; set; }
        public string ConfirmPassword2 { get; set; }
    }
}
