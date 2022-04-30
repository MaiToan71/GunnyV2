using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemSocial
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; }
        public string SocialId { get; set; }
        public string SocialName { get; set; }
        public string SocialEmail { get; set; }
        public int TimeCreate { get; set; }
        public string Ipcreate { get; set; }
    }
}
