using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class LuckyBoxDatum
    {
        public int Id { get; set; }
        public int BoxId { get; set; }
        public int TemplateId { get; set; }
        public int Count { get; set; }
        public bool IsBind { get; set; }
        public int VaildDate { get; set; }
        public int Random { get; set; }
        public int RandomMax { get; set; }
        public bool IsHot { get; set; }
        public bool IsSelected { get; set; }
        public bool IsOnlyVip { get; set; }
        public bool CanMerge { get; set; }
    }
}
