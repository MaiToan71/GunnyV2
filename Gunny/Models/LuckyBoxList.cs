using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class LuckyBoxList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PriceCoin { get; set; }
        public int PriceCg { get; set; }
    }
}
