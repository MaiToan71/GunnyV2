using Gunny.MailSettings;
using Gunny.Models;
using Gunny.Models.ChangePassword;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Gunny.Controllers
{
    public class ChangePasswordController : Controller
    {
        private readonly Member_GMPContext _context;
        public ChangePasswordController(Member_GMPContext context)
        {
            _context = context;
        }
        [Route("doi-mat-khau")]
        public IActionResult Index()
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/dang-nhap");
            }
            else
            {
                return View();
            }
        }
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
        [HttpPost]
        public IActionResult Change(ChangePassword changePassword)
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
                if(changePassword.NewPassword == null || changePassword.ConfirmPassword == null)
                {
                    TempData["AlerMessageError"] = "Không được để trống";
                    return Redirect("/doi-mat-khau");
                }
                if (user.Password != GetMD5(changePassword.OldPassword))
                {
                    TempData["AlerMessageError"] = "Mật khẩu cũ sai";
                    return Redirect("/doi-mat-khau");
                }
                if (changePassword.NewPassword == changePassword.ConfirmPassword)
                {
                    user.Password = GetMD5(changePassword.NewPassword);
                    _context.SaveChanges();
                    Response.Cookies.Delete("gunny_username");
                    Response.Cookies.Delete("gunny_userid");
                    TempData["AlerMessageSuccess"] = "Đã đổi mật khẩu";
                    return Redirect("/dang-nhap");
                }
                else
                {
                    TempData["AlerMessageError"] = "Mật khẩu chưa trùng khớp";
                    return Redirect("/doi-mat-khau");
                }
            }
        }


        [Route("doi-mat-khau-voi-email")]
        public IActionResult ChangePasswordWithEmail()
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
                var mem = new ChangePassword
                {
                    Email = user.MemEmail
                };
                return View(mem);
            }
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

        [HttpPost]
        public IActionResult SendPasswordToEmail(ChangePassword changePassword)
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
                if(user == null)
                {
                    TempData["AlerMessageError"] = "Không có tài khoản";
                    return Redirect("/doi-mat-khau-voi-email");
                }
                if(user.MemEmail != changePassword.Email)
                {
                    TempData["AlerMessageError"] = "Email chưa được đăng ký, vui lòng cập nhật thông tin email";
                    return Redirect("/doi-mat-khau-voi-email");
                }
                var url = Request.Scheme + "://" + Request.Host.Value;
                string newPassword = GetMD5(CreatePassword(15));
                MailContent content = new MailContent
                {
                    To = changePassword.Email,
                    Subject = "Mật khẩu của bạn : " + newPassword,
                    Body = "<p>Đăng nhập <strong>" + url + "/dang-nhap" + "</strong></p>"
                };
                user.Password = newPassword;
                _ = SendMail(content);
                _context.SaveChanges();
                TempData["AlerMessageSucess"] = "Vui lòng kiểm tra email";
                return Redirect("/doi-mat-khau-voi-email");
            }
        }


        [Route("mat-khau-cap-2")]
        public IActionResult PasswordLevel2()
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
                var mem = new ChangePassword
                {
                    Password2 = user.Password2
                };
                return View(mem);
            }
        }

        [HttpPost]
        public IActionResult UpdatePasswordLevel2(ChangePassword changePassword)
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
                if(changePassword.Password2 == null || changePassword.ConfirmPassword2 == null)
                {
                    TempData["AlerMessageError"] = "Bạn phải nhập dữ liệu";
                    return Redirect("/mat-khau-cap-2");
                }
                if(changePassword.Password2 != changePassword.ConfirmPassword2)
                {
                    TempData["AlerMessageError"] = "Nhập lại mật khẩu cấp 2 chưa đúng";
                    return Redirect("/mat-khau-cap-2");
                }
                string newPassword2 = GetMD5(changePassword.Password2);
                user.Password2 = newPassword2;
                _context.SaveChanges();
                TempData["AlerMessageSuccess"] = "Bạn đã cập nhật thành công mật khẩu cấp 2";
                return Redirect("/mat-khau-cap-2");
            }
        }


        [Route("lay-mat-khau-voi-mat-khau-cap-2")]
        public IActionResult UpdatePasswordWithLevel2()
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/dang-nhap");
            }
            else
            {
               
                return View();
            }
        }

        [HttpPost]
        public IActionResult PostUpdatePasswordWithLevel2(ChangePassword changePassword)
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
                if (changePassword.Password2 == null || changePassword.ConfirmPassword == null || changePassword.NewPassword == null)
                {
                    TempData["AlerMessageError"] = "Bạn phải nhập dữ liệu";
                    return Redirect("/lay-mat-khau-voi-mat-khau-cap-2");
                }
                if (changePassword.NewPassword != changePassword.ConfirmPassword)
                {
                    TempData["AlerMessageError"] = "Nhập lại mật khẩu  chưa đúng";
                    return Redirect("/lay-mat-khau-voi-mat-khau-cap-2");
                }
                if(user.Password2== null)
                {
                    TempData["AlerMessageError"] = "Bạn chưa có mật khẩu cấp 2";
                    return Redirect("/lay-mat-khau-voi-mat-khau-cap-2");
                }
                if (user.Password2.Length == 0)
                {
                    TempData["AlerMessageError"] = "Bạn chưa có mật khẩu cấp 2";
                    return Redirect("/lay-mat-khau-voi-mat-khau-cap-2");
                }
                if(user.Password2 != GetMD5(changePassword.Password2))
                {
                    TempData["AlerMessageError"] = "Mật khẩu cấp 2 chưa đúng";
                    return Redirect("/lay-mat-khau-voi-mat-khau-cap-2");
                }
                string newPassword = GetMD5(changePassword.NewPassword);
                user.Password = newPassword;
                _context.SaveChanges();
                TempData["AlerMessageSuccess"] = "Bạn đã cập nhật thành công mật khẩu ";
                return Redirect("/lay-mat-khau-voi-mat-khau-cap-2");
            }
        }
    }
}
