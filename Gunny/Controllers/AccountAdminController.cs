using Gunny.Helper;
using Gunny.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gunny.Controllers
{
    public class AccountAdminController : Controller
    {
        private readonly Member_GMPContext _context;
        Users _users = new Users();
        public AccountAdminController(Member_GMPContext context)
        {
            _context = context;
        }
        public static string CreateName(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
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
                ViewBag.userAgency = null;
                ViewBag.Count = 0;
                if (user.ParentId != null)
                {
                    var userAgency = _context.MemAccounts.FirstOrDefault( m=> m.UserId== user.ParentId);
                    if(userAgency!= null)
                    {
                        ViewBag.userAgency = userAgency;
                        ViewBag.Count = _context.MemAccounts.Where(m => m.UserId == user.ParentId).Count();
                    }
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
                    Nickname = user.Nickname,
                    AvatarName=user.Avatar,
                    CMNDName = user.Cmndname,
                    TotalMoney = user.TotalMoney,
                };
                
                return View(memAccount);
            }
        }

        [HttpPost]
        public async Task<IActionResult> EditMemAccount(Models.InformationMemAccount.User memAccount)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/dang-nhap");
            }
            else
            {
                try
                {
                    int userid = Int32.Parse(cookieValueFromReq);
                    var user = _context.MemAccounts.Find(userid);

                    var listUsers = _context.MemAccounts.Where(m => m.Email == memAccount.Email && m.Email != user.Email);
                    if (listUsers.Count() > 0)
                    {
                        TempData["AlerMessageError"] = "Tài khoản đã tồn tại, hãy nhập tên khác";
                        return Redirect("/ca-nhan");
                    }
                    if (memAccount.Email == null || memAccount.Fullname == null || memAccount.Phone == null ||  memAccount.Nickname == null 
                      )
                    {
                        TempData["AlerMessageError"] = "Hãy điền đầy đủ thông tin";
                        return Redirect("/ca-nhan");
                    }
                 
                    //FILE Avatar
                    var avartar = memAccount.AvatarName;
                    IFormFile fileAvatar = memAccount.AvatarLink;
                    if (memAccount.AvatarName == null)
                    {
                        if (fileAvatar == null || fileAvatar.Length == 0)
                        {
                            TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật ảnh avatar";
                            return Redirect("/ca-nhan");
                        }
                    }
                    if (fileAvatar != null)
                    {
                        if (fileAvatar.Length > 0)
                        {
                            var nameAvatar = CreateName(20);
                            avartar = nameAvatar + fileAvatar.FileName;
                            var path3 = Path.Combine(
                                        Directory.GetCurrentDirectory(), "wwwroot/files",
                                       avartar);

                            using (var stream = new FileStream(path3, FileMode.Create))
                            {
                                await fileAvatar.CopyToAsync(stream);
                            }
                        }
                    }

                    if (user == null)
                    {
                        return Redirect("/dang-nhap");
                    }
                    user.Nickname = memAccount.Nickname;
                    user.Fullname = memAccount.Fullname;
                    user.MemEmail  = memAccount.MemEmail;
                    user.Phone = memAccount.Phone;
                    if (user.IsValidate < 2)
                    {
                        user.IsValidate = 1;
                    }
                    user.Avatar = avartar;
                  
                    _context.SaveChanges();
                    TempData["AlerMessageSuccess"] = "Bạn đã cập nhật thông tin";
                    return Redirect("/ca-nhan");

                }
                catch (Exception)
                {
                    TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật thông tin";
                    return Redirect("/ca-nhan");
                }
            }
        }

        [Route("/trang-chu")]
        public IActionResult Home(int? page)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/dang-nhap");
            }
            else
            {
                int pageNumber = 1;

                if (page == null)
                {
                    pageNumber = 1;
                }
                else
                {
                    pageNumber = (int)page;
                    if (page <= 0)
                    {
                        pageNumber = 1;
                    }
                }
             //   ViewBag.TopUsers = _users.TopHome().Result;
                var list = _users.ListUser(pageNumber).Result;
                ViewBag.ListUsers = list.result;

                ViewBag.Total = list.total;

                List<int> pages = new List<int>();
                int total = (int)list.total;
                for (var i = 0; i <= total / 20; i++)
                {
                    pages.Add(i);
                }
                if (pages.Count() == 0)
                {
                    pages.Add(1);
                }
                ViewBag.pageNumber = pageNumber;
                int prevNumber = pageNumber - 1;
                if (prevNumber <= 0)
                {
                    prevNumber = 1;
                }
                ViewBag.prevNumber = prevNumber;
                int nextNumber = pageNumber + 1;
                if (nextNumber <= 0)
                {
                    nextNumber = 1;
                }
                ViewBag.nextNumber = nextNumber;
                ViewBag.Pages = pages;
                return View();
            }
        }
    }
}
