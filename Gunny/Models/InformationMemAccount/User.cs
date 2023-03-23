using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gunny.Models.InformationMemAccount
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Fullname { get; set; }
        public string Phone { get; set; }
        public IFormFile Cmndpath1 { get; set; }
        public string NameCmndpath1 { get; set; }
        public IFormFile Cmndpath2 { get; set; }
        public string NameCmndpath2 { get; set; }
        public IFormFile AvatarLink { get; set; }
        public string AvatarName { get; set; }
        public string BankNumber { get; set; }
        public string BankName { get; set; }
        public string Cmndnumber { get; set; }
        public string BankUserName { get; set; }
        public bool? IsValidate { get; set; }
        public string MemEmail { get; set; }
        public string Presenter { get; set; }
    }
}
