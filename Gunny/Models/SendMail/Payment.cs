using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gunny.Models.SendMail
{
    public class Payment
    {
        public string Email { set; get; }
        public string NumberOfMoney { get; set; }
        public string Note { get; set; }
    }
}
