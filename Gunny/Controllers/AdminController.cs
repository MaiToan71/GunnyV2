using Gunny.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Gunny.Controllers
{
    public class AdminController : Controller
    {
        public void SetCookie(string key, string value, int? expireTime)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddHours(expireTime.Value);
            Response.Cookies.Append(key, value, option);
        }
        //create a string MD5
        public static string GetMD5(string str)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] fromData = Encoding.UTF8.GetBytes(str);
            byte[] targetData = md5.ComputeHash(fromData);
            string byte2String = null;

            for (int i = 0; i < targetData.Length; i++)
            {
                byte2String += targetData[i].ToString("x2");

            }
            return byte2String;
        }
        private readonly Member_GMPContext _context;
        public AdminController(Member_GMPContext context)
        {
            _context = context;
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult PostLogin(UserAdmin userAdmin)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    string password = GetMD5(userAdmin.Password);
                    var data = _context.UserAdmins.Where(m => m.Username == userAdmin.Username && m.Password == password);
                    if (data.Count() > 0 )
                    {
                        string userid = data.First().Id.ToString();
                        SetCookie("gunny_userid_admin", userid, 9999999);
                        SetCookie("gunny_username_admin", data.First().Username, 9999999);
                        return Redirect("/admin/admingunny");
                    }
                    else
                    {
                        TempData["AlerMessage"] = "Bạn sai tài khoản hoặc mật khẩu";
                        return Redirect("/admin/login");
                    }
                }
                return Redirect("/admin/login");
            }catch(Exception e)
            {
                TempData["AlerMessage"] = "Có lỗi hệ thống";
                return Redirect("/admin/login");
            }

        }


        public IActionResult AdminGunny()
        {
            return View();
        }

        public IActionResult Users()
        {
            return View();
        }
    }
}
