using be_artwork_sharing_platform.Core.Constancs;
using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.RequestOrder;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.RequestOrder;
using be_project_swp.Core.Dtos.Response;
using be_project_swp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text;

namespace be_artwork_sharing_platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestOrderController : ControllerBase
    {
        private readonly IRequestOrderService _requestOrderService;
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;
        private readonly IPayPalService _payPalService;
        private readonly HttpClient _httpClient;

        public RequestOrderController(IRequestOrderService requestOrderService, IAuthService authService, ApplicationDbContext context, IPayPalService payPalService, HttpClient httpClient)
        {
            _requestOrderService = requestOrderService;
            _authService = authService;
            _context = context;
            _payPalService = payPalService;
            _httpClient = httpClient;
        }

        [HttpGet]
        [Route("get-by-id")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<IActionResult> GetRequestOrderById(long id)
        {
            try
            {
                var result = await _requestOrderService.GetRequestById(id);
                if (result == null)
                    return NotFound("Not found Request");
                return Ok(result);
            }
            catch
            {
                return BadRequest("Get Request Failed");
            }
        }

        [HttpPost]
        [Route("send-request")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<IActionResult> SendRequestOrder(string nick_Name, SendRequest sendRequest)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                string nickNameResquest = await _authService.GetCurrentNickName(userName);
                var ressult = await _requestOrderService.SendRequesrOrder(sendRequest, userId, nickNameResquest, nick_Name, userName);
                return StatusCode(ressult.StatusCode, ressult.Message);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("get-mine-request")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<IActionResult> GetRequestOfMines()
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string nickName = await _authService.GetCurrentNickName(userName);
                var result = _requestOrderService.GetMineRequestByNickName(nickName);
                return Ok(result);
            }
            catch
            {
                return BadRequest("Something wrong");
            }
        }

        [HttpGet]
        [Route("get-mine-request-by-id")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<IActionResult> GetRequestOfMinesById(long id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                var result = await _requestOrderService.GetMineRequestById(id, userId);
                if(result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch
            {
                return BadRequest("Something wrong");
            }
        }

        [HttpGet]
        [Route("get-mine-order")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<IActionResult> GetOrderOfMines()
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string nickName = await _authService.GetCurrentNickName(userName);
                var result = _requestOrderService.GetMineOrderByNickName(nickName);
                return Ok(result);
            }
            catch
            {
                return BadRequest("Something wrong");
            }
        }

        [HttpPatch]
        [Route("cancel-request")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> CancelRequest(long id)
        {
            try
            {
                var cancelRequest = new CancelRequest();
                string userName = HttpContext.User.Identity.Name;
                string currentNickName = await _authService.GetCurrentNickName(userName);
                var result = await _requestOrderService.CancelRequestByReceivier(id, cancelRequest, currentNickName, userName);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch]
        [Route("update-request")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> AcceptRequest(long id)
        {
            try
            {
                var updateRequest = new UpdateRequest();
                string userName = HttpContext.User.Identity.Name;
                string currentNickName = await _authService.GetCurrentNickName(userName);
                var result = await _requestOrderService.AcceptRquest(id, updateRequest, currentNickName, userName);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch]
        [Route("update-status-request")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> UpdateStatusRequest(long id, UpdateStatusRequest updateStatusRequest)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                var nickName = await _authService.GetCurrentNickName(userName);
                var result = await _requestOrderService.UpdateStatusRequest(id, nickName, updateStatusRequest, userName);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete-request")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> DeleteRequest(long id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                var result = await _requestOrderService.DeleteRequestBySender(id, userId, userName);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("send-result-artwork")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> SendResultRequest(SendResultRequest sendResultRequest, long id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string nickName = await _authService.GetCurrentNickName(userName);
                var result = await _requestOrderService.SendResultRequest(sendResultRequest, id, nickName, userName);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("create-payment-request")]
        [Authorize]
        public async Task<IActionResult> CreatePaymentRequest(long request_Id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                string nickName = await _authService.GetCurrentNickName(userName);
                var request = await _context.RequestOrders.FirstOrDefaultAsync(a => a.Id == request_Id);
                if (request != null)
                {
                    if (request.NickName_Receivier == nickName)
                    {
                        return BadRequest("You can not pay your request");
                    }
                    var orderResponse = await _requestOrderService.CreatePaymentForRequest(userId, request_Id);
                    return Ok(orderResponse);
                }
                else
                {
                    return NotFound("Request not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost]
        [Route("capture-payment-request")]
        [Authorize]
        public async Task<ActionResult<ResponsePayment>> CapturePayment(string orderId, long request_Id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                string nickName = await _authService.GetCurrentNickName(userName);
                var orderCreated = await _payPalService.IsOrderCreated(orderId);
                if (!orderCreated)
                {
                    return BadRequest(new { Message = "Order not found or not yet created." });
                }
                var response = await SendCaptureRequest(orderId);
                if (response.IsSuccessStatusCode)
                {
                    var result = await _requestOrderService.IsPaymentCaptured(orderId, userId, request_Id, nickName);
                    if (result.IsSucceed)
                    {
                        return Ok(new ResponsePayment()
                        {
                            IsSucceed = result.IsSucceed,
                            StatusCode = result.StatusCode,
                            Message = result.Message,
                            Order_Id = result.Order_Id
                        });
                    }
                    else
                    {
                        return BadRequest(new { Message = "Payment failed." });
                    }
                }
                else
                {
                    return BadRequest(new { Message = "Failed to capture payment." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        private async Task<HttpResponseMessage> SendCaptureRequest(string orderId)
        {
            var accessToken = await _payPalService.GetAccessToken();
            var request = new HttpRequestMessage(HttpMethod.Post, $"https://api.sandbox.paypal.com/v2/checkout/orders/{orderId}/capture");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Content = new StringContent("", Encoding.UTF8, "application/json");

            return await _httpClient.SendAsync(request);
        }
    }
}
