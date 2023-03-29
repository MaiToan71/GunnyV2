using Gunny.Models;
using Gunny.Models.ChangePassword;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using X.PagedList;

namespace Gunny.Controllers
{
    public class AdminController : Controller
    {
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
                    var data = _context.NewUserAdmins.Where(m => m.Username == userAdmin.Username && m.Password == password);
                    if (data.Count() > 0)
                    {
                        string userid = data.First().Id.ToString();
                        SetCookie("gunny_userid_admin", userid, 9999999);
                        SetCookie("gunny_username_admin", data.First().Username, 9999999);
                        return Redirect("/admin/home");
                    }
                    else
                    {
                        TempData["AlerMessage"] = "Bạn sai tài khoản hoặc mật khẩu";
                        return Redirect("/admin/login");
                    }
                }
                return Redirect("/admin/login");
            }
            catch (Exception e)
            {
                TempData["AlerMessage"] = "Có lỗi hệ thống";
                return Redirect("/admin/login");
            }

        }

        [HttpGet]
        public ActionResult Logout()
        {
            Response.Cookies.Delete("gunny_username_admin");
            Response.Cookies.Delete("gunny_userid_admin");
            return Redirect("/admin/login");
        }

        public IActionResult Home()
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/admin/login");
            }
            else
            {
                return View();
            }
        }

        public IActionResult Users(int? page, string username)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/admin/login");
            }
            else
            {
                // 1. Tham số int? dùng để thể hiện null và kiểu int
                // page có thể có giá trị là null và kiểu int.

                // 2. Nếu page = null thì đặt lại là 1.
                if (page == null) page = 1;

                // 3. Tạo truy vấn, lưu ý phải sắp xếp theo trường nào đó, ví dụ OrderBy
                // theo LinkID mới có thể phân trang.

                // 4. Tạo kích thước trang (pageSize) hay là số Link hiển thị trên 1 trang
                int pageSize = 10;
                ViewBag.searchItem = username;

                // 4.1 Toán tử ?? trong C# mô tả nếu page khác null thì lấy giá trị page, còn
                // nếu page = null thì lấy giá trị 1 cho biến pageNumber.
                int pageNumber = (page ?? 1);

                // 5. Trả về các Link được phân trang theo kích thước và số trang.

                if (username == null)
                {
                    ViewBag.MemAccount = (from l in _context.MemAccounts.Where(m => m.IsBlock == false)
                                          select l).OrderByDescending(x => x.UserId).ToPagedList(pageNumber, pageSize);
                }
                else
                {
                    ViewBag.MemAccount = (from l in _context.MemAccounts.Where(m => m.IsBlock == false)
                                          select l).Where(m => m.Email.Contains(username)).OrderByDescending(x => x.UserId).ToPagedList(pageNumber, pageSize);
                }
                return View();
            }
        }


        [Route("admin/users/{id}")]
        public IActionResult Edit(int Id)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/admin/login");
            }
            else
            {
                var user = _context.MemAccounts.Find(Id);
                if (user == null)
                {
                    return Redirect("/admin/login");
                }
                string memId = Id.ToString();
                SetCookie("memId", memId, 9999999);
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
                    CMNDName= user.Cmndname
                };
                return View(memAccount);
            }
        }
        [Route("admin/remove/{id}")]
        public IActionResult RemoveUser(int Id)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {

                return Redirect("/admin/login");
            }
            else
            {
                var user = _context.MemAccounts.Find(Id);
                if (user == null)
                {
                    return Redirect("/admin/login");
                }
               user.IsBlock= true;
                _context.SaveChanges();
                return Redirect("/admin/users");
            }
        }
        [HttpPost]
        public async Task<IActionResult> EditMemAccount(Models.InformationMemAccount.User memAccount)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            string memId = Request.Cookies["memId"];

            if (cookieValueFromReq == null && memId == null)
            {

                return Redirect("/admin/login");
            }
            else
            {
                try
                {

                    int userid = Int32.Parse(memId);
                    var user = _context.MemAccounts.Find(userid);
                    var listUsers = _context.MemAccounts.Where(m => m.Email == memAccount.Email && m.Email != user.Email);
                    if (listUsers.Count() > 0)
                    {
                        TempData["AlerMessageError"] = "Tài khoản đã tồn tại, hãy nhập tên khác";
                        return Redirect("/admin/users/" + memId);
                    }
                    if (memAccount.Email == null || memAccount.Fullname == null || memAccount.Phone == null ||
                        memAccount.BankNumber == null || memAccount.BankName == null || memAccount.Cmndnumber == null ||
                        memAccount.MemEmail == null)
                    {
                        TempData["AlerMessageError"] = "Hãy điền đầy đủ thông tin";
                        return Redirect("/admin/users/" + memId);
                    }

                    //FILE1
                    IFormFile file1 = memAccount.Cmndpath1;
                    var CmndpathName1 = memAccount.NameCmndpath1;
                    if (memAccount.NameCmndpath1 == null)
                    {

                        if (file1 == null || file1.Length == 0)
                        {
                            TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật ảnh mặt trước CMND";
                            return Redirect("/admin/users/" + memId);
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
                            return Redirect("/admin/users/" + memId);
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
                        return Redirect("/admin/login");
                    }

                    user.Email = memAccount.Email;
                    user.Fullname = memAccount.Fullname;
                    user.Phone = memAccount.Phone;
                    user.BankNumber = memAccount.BankNumber;
                    user.BankName = memAccount.BankName;
                    user.Cmndnumber = memAccount.Cmndnumber;
                    user.BankUserName = memAccount.BankUserName;
                    user.MemEmail = memAccount.MemEmail;
                    user.IsValidate = 2;
                    user.Cmndpath1 = CmndpathName1;
                    user.Cmndpath2 = CmndpathName2;
                    user.Avatar = avartar;
                    user.Cmndname = memAccount.CMNDName;
                    user.Nickname = memAccount.Nickname;
                    _context.SaveChanges();
                    TempData["AlerMessageSuccess"] = "Bạn đã cập nhật thông tin";
                    return Redirect("/admin/users/" + memId);

                }
                catch (Exception)
                {
                    TempData["AlerMessageError"] = "Đã có lỗi hệ thống! Chưa cập nhật thông tin";
                    return Redirect("/admin/users/" + memId);
                }
            }
        }

        [Route("PasswordLevel2/users/{id}")]
        public IActionResult PasswordLevel2(int Id)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];

            if (cookieValueFromReq == null)
            {

                return Redirect("/admin/login");
            }
            else
            {
                string memId = Id.ToString();
                SetCookie("memId", memId, 9999999);
                var user = _context.MemAccounts.Find(Id);
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
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            string memId = Request.Cookies["memId"];
            if (cookieValueFromReq == null && memId == null)
            {

                return Redirect("/admin/login");
            }
            else
            {
                int userid = Int32.Parse(memId);
                var user = _context.MemAccounts.Find(userid);
                if (changePassword.Password2 == null || changePassword.ConfirmPassword2 == null)
                {
                    TempData["AlerMessageError"] = "Bạn phải nhập dữ liệu";
                    return Redirect("/PasswordLevel2/users/" + memId);
                }
                if (changePassword.Password2 != changePassword.ConfirmPassword2)
                {
                    TempData["AlerMessageError"] = "Nhập lại mật khẩu cấp 2 chưa đúng";
                    return Redirect("/PasswordLevel2/users/" + memId);
                }
                string newPassword2 = GetMD5(changePassword.Password2);
                user.Password2 = newPassword2;
                user.IsValidatePassword2 = true;
                _context.SaveChanges();
                TempData["AlerMessageSuccess"] = "Bạn đã cập nhật thành công mật khẩu cấp 2";
                return Redirect("/PasswordLevel2/users/" + memId);


            }
        }

        [Route("history/users/{id}")]
        public IActionResult HistoryOfUser(int Id, int? page)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {
                return Redirect("/admin/login");
            }
            else
            {
                // 1. Tham số int? dùng để thể hiện null và kiểu int
                // page có thể có giá trị là null và kiểu int.

                // 2. Nếu page = null thì đặt lại là 1.
                if (page == null) page = 1;

                // 3. Tạo truy vấn, lưu ý phải sắp xếp theo trường nào đó, ví dụ OrderBy
                // theo LinkID mới có thể phân trang.
                var links = (from l in _context.MemAccounts
                             select l).OrderByDescending(x => x.UserId);

                // 4. Tạo kích thước trang (pageSize) hay là số Link hiển thị trên 1 trang
                int pageSize = 10;

                // 4.1 Toán tử ?? trong C# mô tả nếu page khác null thì lấy giá trị page, còn
                // nếu page = null thì lấy giá trị 1 cho biến pageNumber.
                int pageNumber = (page ?? 1);

                // 5. Trả về các Link được phân trang theo kích thước và số trang.

                ViewBag.MemAccount = links.ToPagedList(pageNumber, pageSize);
                string memId = Id.ToString();
                SetCookie("memId", memId, 9999999);
                ViewBag.Histories = _context.MemHistories.Where(m => m.UserId == Id).ToPagedList(pageNumber, pageSize);
                return View();
            }
        }


        public IActionResult Payments(int? page)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {
                return Redirect("/admin/login");
            }
            else
            {
                // 1. Tham số int? dùng để thể hiện null và kiểu int
                // page có thể có giá trị là null và kiểu int.

                // 2. Nếu page = null thì đặt lại là 1.
                if (page == null) page = 1;

                // 3. Tạo truy vấn, lưu ý phải sắp xếp theo trường nào đó, ví dụ OrderBy
                // theo LinkID mới có thể phân trang.


                // 4. Tạo kích thước trang (pageSize) hay là số Link hiển thị trên 1 trang
                int pageSize = 10;

                // 4.1 Toán tử ?? trong C# mô tả nếu page khác null thì lấy giá trị page, còn
                // nếu page = null thì lấy giá trị 1 cho biến pageNumber.
                int pageNumber = (page ?? 1);

                // 5. Trả về các Link được phân trang theo kích thước và số trang.

                ViewBag.Histories = _context.MemHistories.OrderByDescending(m => m.TimeCreate).ToPagedList(pageNumber, pageSize);
                return View();
            }
        }


        public IActionResult IsReadHistory(int? Id)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {
                return Redirect("/admin/login");
            }
            else
            {
                var item = _context.MemHistories.Find(Id);
                item.IsRead = true;
                var user = _context.MemAccounts.Find(item.UserId);
                if (item.TypeCode == 1)
                {
                    user.TotalMoney += item.Value;
                }
                else
                {
                    user.TotalMoney -= item.Value;
                }
                _context.SaveChanges();
                return Redirect("/admin/Payments");
            }
        }

        public IActionResult UnReadHistory(int? Id)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {
                return Redirect("/admin/login");
            }
            else
            {
                var item = _context.MemHistories.Find(Id);
                item.IsRead = false;
                var user = _context.MemAccounts.Find(item.UserId);
                if (item.TypeCode == 1)
                {
                    user.TotalMoney -= item.Value;
                }
                else
                {
                    user.TotalMoney += item.Value;
                }
                _context.SaveChanges();
                return Redirect("/admin/Payments");
            }
        }


        public IActionResult Recharge(int? id)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {
                return Redirect("/admin/login");
            }
            else
            {
                var item = _context.MemAccounts.Find(id);
                return View(item);
            }
        }

        public IActionResult UpdateTotalMoney(MemAccount account)
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {
                return Redirect("/admin/login");
            }
            else
            {
                var item = _context.MemAccounts.Find(account.UserId);
               /* if(account.Money < 0)
                {
                    TempData["AlerMessageError"] = "Nhập số tiền lớn hơn 0";
                    return Redirect("/admin/Recharge?id="+ account.UserId);
                }*/
                item.TotalMoney += account.Money;
                _context.SaveChanges();

                TempData["AlerMessageSuccess"] = "Đã nạp tiền, Vui lòng quay lại kiểm tra ";
                return Redirect("/admin/Recharge?id=" + account.UserId);
            }
        }

        public IActionResult TreeView()
        {
            string cookieValueFromReq = Request.Cookies["gunny_userid_admin"];
            if (cookieValueFromReq == null)
            {
                return Redirect("/admin/login");
            }
            else
            {
                
                return View();
            }
        }
    }
}
