using Gunny.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
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
            var result = _context.MemAccounts.FirstOrDefault(m => m.Email == email);
            if(result != null)
            {
                result.Presenter= presenter;
                _context.SaveChanges();
                return true;
            };
           
            return false;
        }
        [Route("top")]
        public dynamic GetTopUsers()
        {
            var result = _context.MemAccounts.Select(x => new
            {
                x.Email,
                x.Fullname,
               x.Avatar,
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
                .Where(m => m.Email.Contains(search) || m.Fullname.Contains(search))
                .Select(x => new
            {
                x.Email,
                x.Fullname,
                x.Avatar,
            }).OrderByDescending(x => x.Email).Skip((page - 1) * 20).Take(20).ToList();
            return new
            {
                Result = result,
                Total = _context.MemAccounts.Where(m => m.Email.Contains(search) || m.Fullname.Contains(search)).Count()
            };
        }
    }
}
