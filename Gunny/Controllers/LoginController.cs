using Gunny.MailSettings;
using Gunny.Models;
using Gunny.Models.ChangePassword;
using Gunny.Models.InformationMemAccount;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Gunny.Controllers
{
    public class LoginController : Controller
    {
        public void SetCookie(string key, string value, int? expireTime)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddHours(expireTime.Value);
            Response.Cookies.Append(key, value, option);
        }
        public static string CreatePassword(int length)
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

        public async Task SendMail(MailContent mailContent)
        {
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            MailModel mailSettings = new MailModel
            {
                Mail = config["MailSettings:Mail"],
                DisplayName = config["MailSettings:DisplayName"],
                Password = config["MailSettings:Password"],
                Host = config["MailSettings:Host"],
                Port = Int16.Parse(config["MailSettings:Port"])
            };
            var email = new MimeMessage();
            email.Sender = new MailboxAddress(mailSettings.DisplayName, mailSettings.Mail);
            email.From.Add(new MailboxAddress(mailSettings.DisplayName, mailSettings.Mail));
            email.To.Add(MailboxAddress.Parse(mailContent.To));
            email.Subject = mailContent.Subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = mailContent.Body;
            email.Body = builder.ToMessageBody();

            // dùng SmtpClient của MailKit
            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                smtp.Connect(mailSettings.Host, mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(mailSettings.Mail, mailSettings.Password);
                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                // Gửi mail thất bại, nội dung email sẽ lưu vào thư mục mailssave
                System.IO.Directory.CreateDirectory("mailssave");
                var emailsavefile = string.Format(@"mailssave/{0}.eml", Guid.NewGuid());
                await email.WriteToAsync(emailsavefile);

            }

            smtp.Disconnect(true);

        }
        private readonly Member_GMPContext _context;

       
        public LoginController(Member_GMPContext context )
        {
            _context = context;
        }
        [Route("dang-nhap")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult PostLogin(MemAccount memAccount)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var f_password = GetMD5(memAccount.Password);
                    var data = _context.MemAccounts.FirstOrDefault(m => m.Email == memAccount.Email && m.Password == f_password && m.IsBlock == false);
                    if (data != null)
                    {
                        string userid = data.UserId.ToString();
                        SetCookie("gunny_userid", userid, 9999999);
                        SetCookie("gunny_username", data.Email, 9999999);
                        return Redirect("/ca-nhan");
                    }
                    else
                    {
                        TempData["AlerMessage"] = "Bạn sai tài khoản hoặc mật khẩu";
                        return Redirect("/dang-nhap");
                    }
                }
                return Redirect("/dang-nhap");
            }
            catch (Exception e)
            {
                TempData["AlerMessage"] = "Lỗi hệ thống";
                return Redirect("/dang-nhap");
            }

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

        [Route("dang-xuat")]
        [HttpGet]
        public ActionResult Logout()
        {
            Response.Cookies.Delete("gunny_username");
            Response.Cookies.Delete("gunny_userid");
            return Redirect("/");
        }

        [Route("dang-ky")]
        public IActionResult Register()
        {
            return View();
        }
        public bool IsValid(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PostRegisterAsync(UserRegister userRegister)
        {
            if (ModelState.IsValid)
            {
                var checkEmail = _context.MemAccounts.Where(m => m.Email == userRegister.UserName );
                if (checkEmail.Count() > 0)
                {
                    TempData["AlerMessageError"] = "Tên đăng nhập đã có người đăng ký";
                    return Redirect("/dang-ky");
                }
                var hostName = System.Net.Dns.GetHostName();
                var ips = await System.Net.Dns.GetHostAddressesAsync(hostName);
                var count = 0;
                string ipx = "";
                foreach (var ip in ips)
                {
                    if (count == 1)
                    {
                        ipx = ip.ToString();
                    }
                    count++;
                }
                var time = DateTimeOffset.Now.ToUnixTimeSeconds();
                if (userRegister.UserName == null || userRegister.Password == null || userRegister.Password2 == null)
                {
                    TempData["AlerMessageError"] = "Bạn không được để trống thông tin";
                    return Redirect("/dang-ky");
                }
                var f_password = GetMD5(userRegister.Password);
              /*  var f_confirmPassword = GetMD5(userRegister.ConfirmPassword);
                if (userRegister.Password !=  userRegister.ConfirmPassword)
                {
                    TempData["AlerMessageError"] = "Mật khẩu chưa trùng khớp";
                    return Redirect("/dang-ky");
                }*/

                var user = new MemAccount
                {
                    Email = userRegister.UserName,
                    Password = f_password,
                    Fullname = userRegister.UserName,
                    Phone = "",
                    Money = 0,
                    MoneyLock = 0,
                    TotalMoney = 0,
                    MoneyEvent = 0,
                    Point = 0,
                    CountLucky = 0,
                    Viplevel = 0,
                    IsBan = false,
                    Ipcreate = ipx.ToString(),
                    AllowSocialLogin = true,
                    TimeCreate = unchecked((int)time),
                    Password2 = GetMD5(userRegister.Password2),
                    TypeF=0,
                    Nickname= userRegister.Nickname,
                    TotalRoseF2toF7 = 0,
                    TotalRoseF1=0,
                    IsBlock= false,
                };
                _context.MemAccounts.Add(user);
                _context.SaveChanges();
                TempData["SucessMessageAccount"] = "Đăng đăng ký thành công ";
                return Redirect("/dang-ky");
            }
            TempData["AlerMessageError"] = "Lỗi chưa đăng ký được tài khoản";
            return Redirect("/dang-ky");

        }


        [Route("dang-ky-moi-mat-khau")]
        public IActionResult RegisterNewPasswordd()
        {
            return View();
        }

        [HttpPost]
        public IActionResult PostRegisterNewPasswordd(UserRegister userRegister)
        {
          
            var user = _context.MemAccounts.FirstOrDefault(m => m.Email == userRegister.UserName);
            if (user == null)
            {
                TempData["AlerMessageError"] = "Không tồn tại tên đăng nhập";
                return Redirect("/dang-ky-moi-mat-khau");
            }
            if(user.MemEmail == null)
            {
                TempData["AlerMessageError"] = "Tài khoản bạn chưa đăng ký email";
                return Redirect("/dang-ky-moi-mat-khau");
            }
            if(userRegister.Email == null || userRegister.UserName == null)
            {
                TempData["AlerMessageError"] = "Thông tin không được để trống";
                return Redirect("/dang-ky-moi-mat-khau");
            }
            string password = CreatePassword(10);
            var f_password = GetMD5(password);
            var url = Request.Scheme + "://" + Request.Host.Value;
            MailContent content = new MailContent
            {
                To = userRegister.Email,
                Subject = "Mật khẩu của bạn : " + password,
                Body = "<p>Đăng nhập <strong>" + url + "/dang-nhap" + "</strong></p>"
            };
            _ = SendMail(content);
            user.Password = f_password;
            _context.SaveChanges();
            Response.Cookies.Delete("gunny_username");
            Response.Cookies.Delete("gunny_userid");
            TempData["SucessMessageAccount"] = "Vui lòng kiểm tra Email:"+ userRegister.Email +" để lấy mật khẩu đăng nhập";
            return Redirect("/dang-ky-moi-mat-khau");
        }

    }
}
