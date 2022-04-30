using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class News
    {
        public int NewsId { get; set; }
        public string Title { get; set; }
        public int Type { get; set; }
        public string Content { get; set; }
        public int TimeCreate { get; set; }
        public string Link { get; set; }
    }
}
