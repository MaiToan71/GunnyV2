using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class ServerList
    {
        public int ServerId { get; set; }
        public string ServerName { get; set; }
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Database { get; set; }
        public string LinkCenter { get; set; }
        public string LinkRequest { get; set; }
        public string LinkConfig { get; set; }
        public string LinkFlash { get; set; }
        public DateTime DateOpen { get; set; }
        public int IsActive { get; set; }
        public string LoginKey { get; set; }
    }
}
