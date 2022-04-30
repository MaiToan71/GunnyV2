using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemAccountBlock
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Messager { get; set; }
        public int? TimeBlock { get; set; }
    }
}
