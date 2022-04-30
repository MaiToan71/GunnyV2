using Gunny.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gunny.Controllers
{
    public class AccountAdminController : Controller
    {
        private readonly Member_GMPContext _context;
        public AccountAdminController(Member_GMPContext context)
        {
            _context = context;
        }
        [Route("/ca-nhan")]
        public IActionResult Index()
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/dang-nhap");
            }
            else
            {
                int userid = Int32.Parse(cookieValueFromReq);
                var user = _context.MemAccounts.Find(userid);
                if (user == null)
                {
                    return Redirect("/dang-nhap");
                }
                var memAccount = new Models.InformationMemAccount.User
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Fullname = user.Fullname,
                    Phone = user.Phone,
                    MemEmail = user.MemEmail,
                    NameCmndpath1 = user.Cmndpath1,
                    NameCmndpath2 = user.Cmndpath2,
                    BankNumber = user.BankNumber,
                    BankName = user.BankName,
                    Cmndnumber = user.Cmndnumber,
                    BankUserName = user.BankUserName,
                    IsValidate = user.IsValidate,
                };
                return View(memAccount);
            }
        }
    }
}
