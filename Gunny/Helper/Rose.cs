using Gunny.Models;
using System.Collections.Generic;

namespace Gunny.Helper
{
    public class Rose
    {
        private readonly Member_GMPContext _context;
        public Rose(Member_GMPContext context)
        {
            _context = context;
        }

        public dynamic GetUser(string email)
        {
            List<dynamic> users = new List<dynamic>();
            var item = GetByPresenter(email);
            if(item != null)
            {
                users.Add(item);
            }
            return users;
        }

        public  dynamic GetByPresenter(string email)
        {
            var item  = _context.MemAccounts.Find(email);
            if(item == null)
            {
                return null;
            }
            return GetByPresenter(item.Presenter);

        }
    }
}
