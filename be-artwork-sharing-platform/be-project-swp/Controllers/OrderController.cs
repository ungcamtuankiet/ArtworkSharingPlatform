using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_project_swp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IAuthService _authService;

        public OrderController(IOrderService orderService, IAuthService authService)
        {
            _orderService = orderService;
            _authService = authService;
        }

        [HttpGet]
        [Route("get-bill")]
        [Authorize]
        public async Task<IActionResult> GetBill(long id)
        {
            try
            {
                var bill = await _orderService.GetBill(id);
                return Ok(bill);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("get-bill-request")]
        [Authorize]
        public async Task<IActionResult> GetBillRequest(long id)
        {
            try
            {
                var bill = await _orderService.GetBillRequest(id);
                return Ok(bill);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("get-payment-history")]
        [Authorize]
        public async Task<IActionResult> GetPaymentHistory()
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                var result = await _orderService.GetPaymentHistory(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("get-mine-order")]
        [Authorize]
        public async Task<IActionResult> GetMineOrder()
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string currentNickName = await _authService.GetCurrentNickName(userName);
                var result = await _orderService.GetMineOrder(currentNickName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
