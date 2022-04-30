using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemSupport
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Type { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int Status { get; set; }
        public int TimeCreate { get; set; }
        public string Ipcreate { get; set; }
    }
}
