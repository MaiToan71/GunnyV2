using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class LogMomo
    {
        public int Id { get; set; }
        public string Transactionid { get; set; }
        public string Username { get; set; }
        public long Amount { get; set; }
        public DateTime TimeCreate { get; set; }
        public long TotalMoney { get; set; }
    }
}
