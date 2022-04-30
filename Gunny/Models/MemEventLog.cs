using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemEventLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; }
        public int? Int1 { get; set; }
        public int? Int2 { get; set; }
        public int? Int3 { get; set; }
        public int? Int4 { get; set; }
        public string String1 { get; set; }
        public string String2 { get; set; }
        public int TimeCreate { get; set; }
    }
}
