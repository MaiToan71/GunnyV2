using System;
using System.Collections.Generic;

#nullable disable

namespace Gunny.Models
{
    public partial class MemAccount
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Fullname { get; set; }
        public string Phone { get; set; }
        public int Money { get; set; }
        public int MoneyLock { get; set; }
        public int TotalMoney { get; set; }
        public int MoneyEvent { get; set; }
        public int Point { get; set; }
        public int CountLucky { get; set; }
        public int Viplevel { get; set; }
        public int Vipexp { get; set; }
        public bool IsBan { get; set; }
        public string Ipcreate { get; set; }
        public bool? AllowSocialLogin { get; set; }
        public int? TimeCreate { get; set; }
        public string Cmndpath1 { get; set; }
        public string BankNumber { get; set; }
        public string BankName { get; set; }
        public string Cmndnumber { get; set; }
        public int? IsValidate { get; set; }
        public string BankUserName { get; set; }
        public string Cmndpath2 { get; set; }
        public string MemEmail { get; set; }
        public string Password2 { get; set; }
        public bool? IsValidatePassword2 { get; set; }
        public bool? IsBlock { get; set; }
        public string ParentId { get; set; }
        public string Presenter { get; set; }
        public string Avatar { get; set; }
        public string Nickname { get; set; }
        public string CMNDName { get; set; }
        public int? TypeF { get; set; }
        public string EmailF0 { get; set; }
    }
}
