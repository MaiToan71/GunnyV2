using Gunny.MailSettings;
using Gunny.Models;
using Gunny.Models.SendMail;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gunny.Controllers
{
    public class PaymentController : Controller
    {  private readonly Member_GMPContext _context;

       
        public PaymentController(Member_GMPContext context )
        {
            _context = context;
        }
        [Route("nap-the")]
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
                var memAccount = new Gunny.Models.SendMail.Payment
                {
                    Email = user.Email,
                    NumberOfMoney ="",
                    Note="",
                };
                return View(memAccount);
            }
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
        public async Task<IActionResult> PostIndexAsync(Gunny.Models.SendMail.Payment payment)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            int userid = Int32.Parse(cookieValueFromReq);
            var user = _context.MemAccounts.Find(userid);
            if (payment.NumberOfMoney == null || payment.Note == null )
            {
                TempData["AlerMessageError"] = "Không được để trống thông tin gửi";
                return Redirect("/nap-the");
            }
            if(user.Email == null)
            {
                TempData["AlerMessageError"] = "Bạn chưa xác minh email";
                return Redirect("/nap-the");
            }
           
                var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                MailContent content = new MailContent
                {
                    To = config["MailSettingsAdmin:Mail"],
                    Subject = "Thông tin nạp thẻ tài khoản : " + user.Email,
                    Body = $@" <p>Email/Tài khoản: {user.Email}</p>
                            <p>Số tiền cần nạp: {payment.NumberOfMoney}</p>
                            <p>Thông tin ghi chú: {payment.Note} </p>"
                };
                _ = SendMail(content);
                var time = DateTimeOffset.Now.ToUnixTimeSeconds();
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
                var memHistory = new MemHistory
                {
                    UserId = userid,
                    Type = "Nạp tiền",
                    TypeCode = 1,
                    Content = content.Body,
                    TimeCreate = unchecked((int)time),
                    Ipcreate = ipx.ToString(),
                };
                _context.MemHistories.Add(memHistory);
                _context.SaveChanges();
                TempData["AlerMessageSuccess"] = "Bạn đã gửi thông tin Email đến Admin";
                return Redirect("/nap-the");
           
        }

        [Route("rut-tien")]
        public IActionResult Withdraw()
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
                var memAccount = new Gunny.Models.SendMail.Payment
                {
                    Email = user.Email,
                    NumberOfMoney = "",
                    Note = "",
                };
                return View(memAccount);
            }
        }
        [HttpPost]
        public async Task<IActionResult> PostWithdrawAsync(Gunny.Models.SendMail.Payment payment)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            int userid = Int32.Parse(cookieValueFromReq);
            var user = _context.MemAccounts.Find(userid);
            if (payment.NumberOfMoney == null || payment.Note == null)
            {
                TempData["AlerMessageError"] = "Không được để trống thông tin gửi";
                return Redirect("/nap-the");
            }
            if (user.Email == null)
            {
                TempData["AlerMessageError"] = "Bạn chưa xác minh email";
                return Redirect("/nap-the");
            }
           
                var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                MailContent content = new MailContent
                {
                    To = config["MailSettingsAdmin:Mail"],
                    Subject = "Thông tin rút tiền tài khoản :" + user.Email,
                    Body = $@" <p>Tài khoản: {user.Email}</p>
                            <p>Số tiền rút: {payment.NumberOfMoney}</p>
                            <p>Thông tin ghi chú: {payment.Note} </p>"
                };
                _ = SendMail(content);
                var time = DateTimeOffset.Now.ToUnixTimeSeconds();
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
                var memHistory = new MemHistory
                {
                    UserId = userid,
                    Type = "Rút tiền",
                    TypeCode = 2,
                    Content = content.Body,
                    TimeCreate = unchecked((int)time),
                    Ipcreate = ipx.ToString(),
                };
                _context.MemHistories.Add(memHistory);
                _context.SaveChanges();
                TempData["AlerMessageSuccess"] = "Bạn đã gửi thông tin Email đến Admin";
                return Redirect("/rut-tien");
            
        }


    }
}
