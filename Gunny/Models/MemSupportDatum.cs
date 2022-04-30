using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemSupportDatum
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public int? TimeCreate { get; set; }
    }
}
