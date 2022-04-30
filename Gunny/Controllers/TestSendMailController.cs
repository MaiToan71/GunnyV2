using Gunny.MailSettings;
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
    public class TestSendMailController : Controller
    {
      
        public IActionResult Index()
        {
           
           
            MailContent content = new MailContent
            {
                To = "maivantoan339@gmail.com",
                Subject = "Kiểm tra thử",
                Body = "<p><strong>Xin chào xuanthulab.net</strong></p>"
            };
            _ = SendMail(content);
            return View();
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
    }
}
