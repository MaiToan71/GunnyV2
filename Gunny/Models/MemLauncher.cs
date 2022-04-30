using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemLauncher
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string KeyVerify { get; set; }
        public int? TimeCreate { get; set; }
    }
}
