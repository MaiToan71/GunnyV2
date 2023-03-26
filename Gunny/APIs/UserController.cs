using Gunny.Models;
using Gunny.Models.SendMail;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System;
using System.Drawing;
using System.Linq;

namespace Gunny.APIs
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly Member_GMPContext _context;
        public UserController(Member_GMPContext context)
        {
            _context = context;
        }
        [Route("email/{email}")]
        public dynamic GetAllUser(string email)
        {
            Nullable<int> nullable = null;
            var item = _context.MemAccounts.Select( m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == email);
            if(item == null)
            {
                return new
                {
                    item = item,
                    item1 = nullable,
                    item2 = nullable,
                    item3 = nullable,
                    item4 = nullable,
                    item5 = nullable,
                    item6 = nullable,
                    item7 = nullable,
                };
            }
            var item1 = _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == item.Presenter);
            if (item1 == null)
            {
                return new
                {
                    item = item,
                    item1 = item1,
                    item2 = nullable,
                    item3 = nullable,
                    item4 = nullable,
                    item5 = nullable,
                    item6 = nullable,
                    item7 = nullable,
                };
            }
            var item2 = _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == item1.Presenter);
            if (item2 == null)
            {
                return new
                {
                    item = item,
                    item1 = item1,
                    item2 = item2,
                    item3 = nullable,
                    item4 = nullable,
                    item5 = nullable,
                    item6 = nullable,
                    item7 = nullable,
                };
            }
            var item3 = _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == item2.Presenter);
            if (item3 == null)
            {
                return new
                {
                    item = item,
                    item1 = item1,
                    item2 = item2,
                    item3 = item3,
                    item4 = nullable,
                    item5 = nullable,
                    item6 = nullable,
                    item7 = nullable,
                };
            }
            var item4 = _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == item3.Presenter);
            if (item4 == null)
            {
                return new
                {
                    item = item,
                    item1 = item1,
                    item2 = item2,
                    item3 = item3,
                    item4 = item4,
                    item5 = nullable,
                    item6 = nullable,
                    item7 = nullable,
                };
            }
            var item5= _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == item4.Presenter);
            if (item5== null)
            {
                return new
                {
                    item = item,
                    item1 = item1,
                    item2 = item2,
                    item3 = item3,
                    item4 = item4,
                    item5 = item5,
                    item6 = nullable,
                    item7 = nullable,
                };
            }
            var item6 = _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == item5.Presenter);
            if (item6 == null)
            {
                return new
                {
                    item = item,
                    item1 = item1,
                    item2 = item2,
                    item3 = item3,
                    item4 = item4,
                    item5 = item5,
                    item6 = item6,
                    item7 = nullable,
                };
            }
            var item7= _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).FirstOrDefault(m => m.Email == item6.Presenter);

            return new
            {
                item = item,
                item1 = item1,
                item2= item2,
                item3 = item3,
                item4 = item4,
                item5 = item5,
                item6 = item6,
                item7 = item7,
            };
        }
        [Route("all")]
        public dynamic GetAllUser()
        {
            var result = _context.MemAccounts.Select(m => new
            {
                m.UserId,
                m.Email,
                m.Presenter,
                m.Fullname,
                m.Nickname,
            }).ToList();
            return result;
        }
        [Route("{email}")]
        public dynamic GetUser(string email)
        {
            var result = _context.MemAccounts.Where(m =>  m.Email == email).Select(m => new
            {
                m.Email,
                m.Presenter
            }).First();
            return result;
        }
        [Route("{email}/{presenter}")]
        [HttpPost]
        public dynamic PostPresenter(string email, string presenter)
        {
            var parent= _context.MemAccounts.FirstOrDefault(m => m.Email == presenter);
            if(parent == null)
            {
                return false;
            }
            var child = _context.MemAccounts.FirstOrDefault(m => m.Email == email);
           
            if(child == null)
            {
               
                return false;
            };
            var checkEdit = false;
            if(child.Presenter ==null)
            {
                var checkChild = _context.MemAccounts.Where(m => m.Presenter == child.Email).Count();
                if(checkChild > 0)
                {
                    checkEdit = true;
                }

            }
            if (checkEdit == false)
            {
                child.Presenter = presenter;

                child.TypeF = parent.TypeF + 1;
                if (child.TypeF == 1)
                {
                    child.EmailF0 = presenter;
                }
                else
                {
                    child.EmailF0 = parent.EmailF0;
                }
                _context.SaveChanges();
            }
            return true;
        }
        [Route("top")]
        public dynamic GetTopUsers()
        {
            var result = _context.MemAccounts.Select(x => new
            {
                x.Email,
                x.Fullname,
               x.Avatar,
               x.Nickname,
                Count = _context.MemAccounts.Where(m => m.Presenter == x.Email).Count(),
            }).OrderByDescending( x=>x.Count).Skip((1 - 1) * 8).Take(8).ToList();
            return result;
        }

        [Route("all/{page}")]
        public dynamic GetAll(int page)
        {
            var result = _context.MemAccounts.Select(x => new
            {
                x.Email,
                x.Fullname,
                x.Avatar,
                x.Nickname,
            }).OrderByDescending(x => x.Email).Skip((page - 1) * 30).Take(20).ToList();
            return new
            {
                Result = result,
                Total = _context.MemAccounts.Count()
            };
        }

        [Route("search/{search}/{page}")]
        public dynamic GetAll(int page, string search)
        {
            var result = _context.MemAccounts
                .Where(m => m.Email.Contains(search) || m.Fullname.Contains(search) || m.Nickname.Contains(search))
                .Select(x => new
            {
                x.Email,
                x.Fullname,
                x.Avatar,
                    x.Nickname,
                }).OrderByDescending(x => x.Email).Skip((page - 1) * 20).Take(20).ToList();
            return new
            {
                Result = result,
                Total = _context.MemAccounts.Where(m => m.Email.Contains(search) || m.Fullname.Contains(search)).Count()
            };
        }
    }
}
