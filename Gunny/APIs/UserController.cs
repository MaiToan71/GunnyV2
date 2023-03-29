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
        [Route("{id}")]
        public dynamic GetUser(int id)
        {
            var result = _context.MemAccounts.Where(m =>  m.UserId == id).Select(m => new
            {
                m.Parent,
                m.Email,
                m.Presenter,
                m.ParentId,
                m.UserId,
            }).First();
            return result;
        }
        [Route("{userid}/{userIdSelected}")]
        [HttpPost]
        public dynamic PostPresenter(int userid, int userIdSelected)
        {
            var parent= _context.MemAccounts.FirstOrDefault(m => m.UserId == userIdSelected);
            if(parent == null)
            {
                return false;
            }
            var child = _context.MemAccounts.FirstOrDefault(m => m.UserId == userid);
           
            if(child == null)
            {
               
                return false;
            };
            var checkEdit = false;
            if(child.ParentId ==null)
            {
                var checkChild = _context.MemAccounts.Where(m => m.ParentId == child.UserId).Count();
                if(checkChild > 0)
                {
                    checkEdit = true;
                }

            }
            if (checkEdit == false)
            {
                child.ParentId = userIdSelected;
                _context.SaveChanges();
            }
            return true;
        }
        [Route("top")]
        public dynamic GetTopUsers()
        {
            var result = _context.MemAccounts.Select(x => new
            {
                x.ParentId,
                x.UserId,
                x.Email,
                x.Fullname,
               x.Avatar,
               x.Nickname,
                Count = _context.MemAccounts.Where(m => m.Presenter == x.Email).Count(),
            }).OrderByDescending( x=>x.Count).Skip((1 - 1) * 10).Take(10).ToList();
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
                x.TotalRoseF2toF7,
                x.TotalRoseF1,
                x.UserId,
                Count = x.InverseParent.Count()
            }).OrderByDescending(x => x.Count).Skip((page - 1) * 30).Take(20).ToList();
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
