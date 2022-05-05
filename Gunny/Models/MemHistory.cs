using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; }
        public int? TypeCode { get; set; }
        public string Content { get; set; }
        public int Value { get; set; }
        public int? TimeCreate { get; set; }
        public string Ipcreate { get; set; }
        public bool? IsRead { get; set; }
    }
}
