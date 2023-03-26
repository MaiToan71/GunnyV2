using Gunny.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using X.PagedList;

namespace Gunny.Controllers
{
    public class AccountController : Controller
    {
        public void SetCookie(string key, string value, int? expireTime)
        {
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddHours(expireTime.Value);
            Response.Cookies.Append(key, value, option);
        }
        private string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName)
                      + "_"
                      + Guid.NewGuid().ToString().Substring(0, 4);
        }
        private readonly Member_GMPContext _context;
        public AccountController(Member_GMPContext context)
        {
            _context = context;
        }
        [Route("thong-tin-tai-khoan")]
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
                    AvatarName = user.Avatar,
                    Presenter = user.Presenter,
                    Nickname = user.Nickname,
                    TotalMoney = user.TotalMoney,
                    CMNDName = user.Cmndname,
                   
                };
                return View(memAccount);
            }
        }
        public IActionResult ListUser(int? page)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/dang-nhap");
            }
            else
            {
                ViewBag.ListUsers = null;
                int userid = Int32.Parse(cookieValueFromReq);
                var user = _context.MemAccounts.Find(userid);
                if (user == null)
                {
                    return Redirect("/dang-nhap");
                }
                if (user.Presenter != null)
                {
                    // 1. Tham số int? dùng để thể hiện null và kiểu int
                    // page có thể có giá trị là null và kiểu int.

                    // 2. Nếu page = null thì đặt lại là 1.
                    if (page == null) page = 1;

                    // 3. Tạo truy vấn, lưu ý phải sắp xếp theo trường nào đó, ví dụ OrderBy
                    // theo LinkID mới có thể phân trang.
                    var listUserLevel2 = _context.MemAccounts.Where(m => m.Presenter.Contains(user.Email)).OrderByDescending(x => x.UserId);
                    // 4. Tạo kích thước trang (pageSize) hay là số Link hiển thị trên 1 trang
                    int pageSize = 10;
                    // 4.1 Toán tử ?? trong C# mô tả nếu page khác null thì lấy giá trị page, còn
                    // nếu page = null thì lấy giá trị 1 cho biến pageNumber.
                    int pageNumber = (page ?? 1);
                    // 5. Trả về các Link được phân trang theo kích thước và số trang.

                    ViewBag.ListUsers = listUserLevel2.ToPagedList(pageNumber, pageSize);
                }
                return View();
            }
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
                        return Redirect("/thong-tin-tai-khoan");
                    }
                    if (memAccount.Email == null || memAccount.Fullname == null || memAccount.Phone == null ||
                        memAccount.BankNumber == null || memAccount.BankName == null || memAccount.Cmndnumber == null ||
                        memAccount.MemEmail == null || memAccount.Nickname == null || memAccount.CMNDName == null)
                    {
                        TempData["AlerMessageError"] = "Hãy điền đầy đủ thông tin";
                        return Redirect("/thong-tin-tai-khoan");
                    }

                    //FILE1
                    IFormFile file1 = memAccount.Cmndpath1;
                    var CmndpathName1 = memAccount.NameCmndpath1;
                    if (memAccount.NameCmndpath1 == null)
                    {

                        if (file1 == null || file1.Length == 0)
                        {
                            TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật ảnh mặt trước CMND";
                            return Redirect("/thong-tin-tai-khoan");
                        }

                    }
                    if (file1 != null)
                    {
                        if (file1.Length > 0)
                        {
                            var nameFile1 = CreateName(20);
                            CmndpathName1 = nameFile1 + file1.FileName;
                            var path1 = Path.Combine(
                                        Directory.GetCurrentDirectory(), "wwwroot/files",
                                       CmndpathName1);

                            using (var stream = new FileStream(path1, FileMode.Create))
                            {
                                await file1.CopyToAsync(stream);
                            }
                        }
                    }
                    //FILE2
                    var CmndpathName2 = memAccount.NameCmndpath2;
                    IFormFile file2 = memAccount.Cmndpath2;
                    if (memAccount.NameCmndpath2 == null)
                    {

                        if (file2 == null || file2.Length == 0)
                        {
                            TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật ảnh mặt sau CMND";
                            return Redirect("/thong-tin-tai-khoan");
                        }
                    }
                    if (file2 != null)
                    {
                        if (file2.Length > 0)
                        {
                            var nameFile2 = CreateName(20);
                            CmndpathName2 = nameFile2 + file2.FileName;
                            var path2 = Path.Combine(
                                        Directory.GetCurrentDirectory(), "wwwroot/files",
                                       CmndpathName2);

                            using (var stream = new FileStream(path2, FileMode.Create))
                            {
                                await file2.CopyToAsync(stream);
                            }
                        }
                    }
                    //FILE Avatar
                    var avartar = memAccount.AvatarName;
                    IFormFile fileAvatar = memAccount.AvatarLink;
                    if (memAccount.AvatarName == null)
                    {
                        if (fileAvatar == null || fileAvatar.Length == 0)
                        {
                            TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật ảnh avatar";
                            return Redirect("/thong-tin-tai-khoan");
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

                    // user.Email = memAccount.Email;
                    user.Fullname = memAccount.Fullname;
                    user.Phone = memAccount.Phone;
                    user.BankNumber = memAccount.BankNumber;
                    user.BankName = memAccount.BankName;
                    user.Cmndnumber = memAccount.Cmndnumber;
                    user.BankUserName = memAccount.BankUserName;
                    user.MemEmail = memAccount.MemEmail;
                    user.IsValidate = 1;
                    user.Cmndpath1 = CmndpathName1;
                    user.Cmndpath2 = CmndpathName2;
                    user.Avatar = avartar;
                    user.Cmndname = memAccount.CMNDName;
                    user.Nickname = memAccount.Nickname;

                    _context.SaveChanges();
                    TempData["AlerMessageSuccess"] = "Bạn đã cập nhật thông tin";
                    return Redirect("/thong-tin-tai-khoan");

                }
                catch (Exception)
                {
                    TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật thông tin";
                    return Redirect("/thong-tin-tai-khoan");
                }
            }
        }
    }
}
