using Microsoft.AspNetCore.Mvc;

namespace MSFT.UE.Rooms.Controllers
{
    public class MapController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Route("/map")]
        public IActionResult Map()
        {
            return View();
        }
    }
}