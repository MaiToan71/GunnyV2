using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class IpBlock
    {
        public int? UserId { get; set; }
        public string UserIp { get; set; }
        public string BlockTime { get; set; }
        public string Blocked { get; set; }
    }
}
