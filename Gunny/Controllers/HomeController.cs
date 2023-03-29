using Gunny.Helper;
using Gunny.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using X.PagedList;

namespace Gunny.Controllers
{
    public class HomeController : Controller
    {
        Users _users = new Users();

        public IActionResult Index(int? page)
        {
          /*  int pageNumber = 1;

            if (page == null)
            {
                pageNumber = 1;
            }
            else
            {
                pageNumber = (int)page;
                if (page <= 0)
                {
                    pageNumber = 1;
                }
            }
            ViewBag.TopUsers = _users.TopHome().Result;
            var list = _users.ListUser(pageNumber).Result;
            ViewBag.ListUsers = list.result;

            ViewBag.Total = list.total;

            List<int> pages = new List<int>();
            int total = (int)list.total;
            for (var i = 0; i <= total / 20; i++)
            {
                pages.Add(i);
            }
            if (pages.Count() == 0)
            {
                pages.Add(1);
            }
            ViewBag.pageNumber = pageNumber;
            int prevNumber = pageNumber - 1;
            if (prevNumber <= 0)
            {
                prevNumber = 1;
            }
            ViewBag.prevNumber = prevNumber;
            int nextNumber = pageNumber + 1;
            if (nextNumber <= 0)
            {
                nextNumber = 1;
            }
            ViewBag.nextNumber = nextNumber;
            ViewBag.Pages = pages;*/
            return Redirect("/dang-nhap");
        }

        [Route("/tim-kiem/{search}")]
        public IActionResult Search(int? page, string search)
        {
            /* int pageNumber = 1;

             if (page == null)
             {
                 pageNumber = 1;
             }
             else
             {
                 pageNumber = (int)page;
                 if (page <= 0)
                 {
                     pageNumber = 1;
                 }
             }
             var list = _users.SearchListUser(pageNumber, search).Result;
             ViewBag.ListUsers = list.result;

             ViewBag.Total = list.total;
             ViewBag.Search = search;

             List<int> pages = new List<int>();
             int total = (int)list.total;
             for (var i = 0; i <= total / 20; i++)
             {
                 pages.Add(i);
             }
             if (pages.Count() == 0)
             {
                 pages.Add(1);
             }
             ViewBag.pageNumber = pageNumber;
             int prevNumber = pageNumber - 1;
             if (prevNumber <= 0)
             {
                 prevNumber = 1;
             }
             ViewBag.prevNumber = prevNumber;
             int nextNumber = pageNumber + 1;
             if (nextNumber <= 0)
             {
                 nextNumber = 1;
             }
             ViewBag.nextNumber = nextNumber;
             ViewBag.Pages = pages;*/
            return Redirect("/dang-nhap");
        }
    }
}
