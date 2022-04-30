using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gunny.Controllers
{
    public class AccountAdminController : Controller
    {
        [Route("/ca-nhan")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
