using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemBag
    {
        public int ItemId { get; set; }
        public int ServerId { get; set; }
        public int UserId { get; set; }
        public int TemplateId { get; set; }
        public int Count { get; set; }
        public int StrengthenLevel { get; set; }
        public bool IsBind { get; set; }
        public int VaildDate { get; set; }
        public bool IsSend { get; set; }
    }
}
