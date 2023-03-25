using Gunny.MailSettings;
using Gunny.Models;
using Gunny.Models.SendMail;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using X.PagedList;

namespace Gunny.Controllers
{
    public class PaymentController : Controller
    {  private readonly Member_GMPContext _context;

       
        public PaymentController(Member_GMPContext context )
        {
            _context = context;
        }
        [Route("nap-tai-khoan")]
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
                    NumberOfMoney =0,
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
                return Redirect("/nap-tai-khoan");
            }
            if(user.Email == null)
            {
                TempData["AlerMessageError"] = "Bạn chưa xác minh email";
                return Redirect("/nap-tai-khoan");
            }
           
                var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                MailContent content = new MailContent
                {
                    To = config["MailSettingsAdmin:Mail"],
                    Subject = "Thông tin nạp thẻ tài khoản : " + user.Email,
                    Body = $@" <p>Email/Tài khoản: {user.Email}</p>
                            <p>Số tiền cần nạp: <span class='moneys'>{payment.NumberOfMoney}</span></p>
                            <p>Thông tin ghi chú: {payment.Note} </p>"
                };
              /*  _ = SendMail(content);*/
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
                    Value = (int)payment.NumberOfMoney,
                };
                _context.MemHistories.Add(memHistory);
                _context.SaveChanges();
                TempData["AlerMessageSuccess"] = "Bạn đã gửi thông tin đến Admin";
                return Redirect("/nap-tai-khoan");
           
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
                    NumberOfMoney = 0,
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
                return Redirect("/nap-tai-khoan");
            }
            if (user.Email == null)
            {
                TempData["AlerMessageError"] = "Bạn chưa xác minh email";
                return Redirect("/nap-tai-khoan");
            }
           
                var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                MailContent content = new MailContent
                {
                    To = config["MailSettingsAdmin:Mail"],
                    Subject = "Thông tin rút tiền tài khoản :" + user.Email,
                    Body = $@" <p>Tài khoản: {user.Email}</p>
                            <p>Số tiền cần nạp: <span class='moneys'>{payment.NumberOfMoney}</span></p>
                            <p>Thông tin ghi chú: {payment.Note} </p>"
                };
             /*   _ = SendMail(content);*/
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
                    Value= (int)payment.NumberOfMoney,
                    TimeCreate = unchecked((int)time),
                    Ipcreate = ipx.ToString(),
                };
                _context.MemHistories.Add(memHistory);
                _context.SaveChanges();
                TempData["AlerMessageSuccess"] = "Bạn đã gửi thông tin đến Admin";
                return Redirect("/rut-tien");
            
        }

        [Route("lich-su-nap-rut")]
        public IActionResult UserHistory(int? page)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/dang-nhap");
            }
            else
            {
                int userid = Int32.Parse(cookieValueFromReq);
                // 1. Tham số int? dùng để thể hiện null và kiểu int
                // page có thể có giá trị là null và kiểu int.

                // 2. Nếu page = null thì đặt lại là 1.
                if (page == null) page = 1;

                // 3. Tạo truy vấn, lưu ý phải sắp xếp theo trường nào đó, ví dụ OrderBy
                // theo LinkID mới có thể phân trang.
                var links = _context.MemHistories.Where(m => m.UserId == userid);

                // 4. Tạo kích thước trang (pageSize) hay là số Link hiển thị trên 1 trang
                int pageSize = 10;

                // 4.1 Toán tử ?? trong C# mô tả nếu page khác null thì lấy giá trị page, còn
                // nếu page = null thì lấy giá trị 1 cho biến pageNumber.
                int pageNumber = (page ?? 1);

                // 5. Trả về các Link được phân trang theo kích thước và số trang.
                ViewBag.Histories = links.OrderByDescending(m => m.TimeCreate).ToPagedList(pageNumber, pageSize);
                return View();
            }
        }

    }
}
