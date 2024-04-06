using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.Response;
using be_project_swp.Core.Entities;
using be_project_swp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PayPal.Api;
using System.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Order = be_project_swp.Core.Entities.Order;


namespace be_project_swp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPayPalService _payPalService;
        private readonly HttpClient _httpClient;
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;

        public PaymentController(IPayPalService payPalService, HttpClient httpClient, IAuthService authService, ApplicationDbContext context)
        {
            _payPalService = payPalService;
            _httpClient = httpClient;
            _authService = authService;
            _context = context;
        }

        /*        [HttpPost]
                [Route("create-payment")]
                [Authorize]
                public async Task<IActionResult> CreatePayment(decimal amount, long artwork_Id)
                {
                    try
                    {
                        string userName = HttpContext.User.Identity.Name;
                        string userId = await _authService.GetCurrentUserId(userName);
                        var orderResponse = await _payPalService.CreateOrder(amount, userId, artwork_Id);
                        var orderCreated = await _payPalService.IsOrderCreated(orderResponse.Order.id);
                        if (!orderCreated)
                        {
                            return BadRequest(new { Message = "Order not found or not yet created." });
                        }
                        var response = await SendCaptureRequest(orderResponse.Order.id);
                        if (response.IsSuccessStatusCode)
                        {
                            bool paymentSuccessful = await _payPalService.IsPaymentCaptured(orderResponse.Order.id);
                            if (paymentSuccessful)
                            {

                                return Ok(new { Message = "Payment successfully captured." });
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
                }*/

        /*       [HttpPost]
       [Route("create-payment")]
       [Authorize]
       public async Task<IActionResult> CreateOrder(decimal amount)
       {
           var response = await _payPalService.CreateOrder(amount);

           if (response != null && response.IsSuccessStatusCode)
           {
               var jsonResponse = await response.Content.ReadAsStringAsync();
               var responseObject = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonResponse);
               if (responseObject.TryGetValue("links", out var links))
               {
                   if (links is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Array)
                   {
                       return Ok(new { Links = links });
                   }
                   else
                   {
                       var orderId = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonResponse)["id"];
                       return Ok(new { OrderId = orderId });
                   }
               }
               else
               {
                   var orderId = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonResponse)["id"];
                   return Ok(new { OrderId = orderId });
               }
           }
           return BadRequest();
       }

       [HttpPost]
       [Route("capture-payment")]
       [Authorize]
       public async Task<IActionResult> CapturePayment(string orderId)
       {
           var result = await _payPalService.CapturePayment(orderId);
           return StatusCode(result.StatusCode, result.Message);
       }*/

        [HttpPost]
        [Route("create-payment")]
        [Authorize]
        public async Task<IActionResult> CreatePayment(long artwork_Id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                string nickName = await _authService.GetCurrentNickName(userName);
                var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == artwork_Id);
                if(artwork != null)
                {
                    if(artwork.User_Id == userId)
                    {
                        return BadRequest("You can not buy your artwork");
                    }
                    else if(artwork.Owner != "")
                    {
                        if(artwork.Owner == nickName) return BadRequest("You bought this Artwork");
                        return BadRequest($"This Artwork of art is owned by {artwork.Owner}");
                    }
                    var orderResponse = await _payPalService.CreateOrder(userId, artwork_Id, nickName);
                    return Ok(orderResponse);
                }
                else
                {
                    return NotFound("Artwork not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /*        [HttpPost]
                [Route("capture-payment")]
                [Authorize]
                public async Task<IActionResult> CapturePayment(string orderId)
                {
                    try
                    {
                        var request = new HttpRequestMessage(HttpMethod.Post, $"https://api.sandbox.paypal.com/v2/checkout/orders/{orderId}/capture");
                        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", await _payPalService.GetAccessToken());
                        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                        var response = await _httpClient.SendAsync(request);

                        if (response.IsSuccessStatusCode)
                        {
                            var jsonResponse = await response.Content.ReadAsStringAsync();
                            return Ok(jsonResponse);
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
                }*/

        [HttpPost]
        [Route("capture-payment")]
        [Authorize]
        public async Task<ActionResult<ResponsePayment>> CapturePayment(string orderId, long artwork_Id)
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
                    var result = await _payPalService.IsPaymentCaptured(orderId, userId, artwork_Id, nickName);
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
