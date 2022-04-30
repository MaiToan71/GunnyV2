using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class LogCard
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Serial { get; set; }
        public string Passcard { get; set; }
        public int? Money { get; set; }
        public int? TimeCreate { get; set; }
        public int? Type { get; set; }
        public string TaskId { get; set; }
    }
}
