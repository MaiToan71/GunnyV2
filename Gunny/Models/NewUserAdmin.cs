using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class NewUserAdmin
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int? Type { get; set; }
    }
}
