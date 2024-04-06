using be_artwork_sharing_platform.Core.Dtos.Auth;
using be_artwork_sharing_platform.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using be_artwork_sharing_platform.Core.Entities;
using Microsoft.AspNetCore.Identity;
using be_project_swp.Core.Interfaces;
using be_project_swp.Core.Dtos.Auth;
using RandomNumberGenerator = be_project_swp.Core.Constancs.RandomNumberGenerator;
using be_project_swp.Core.Entities;
using be_artwork_sharing_platform.Core.DbContext;
using ResetPassword = be_project_swp.Core.Entities.ResetPassword;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using be_project_swp.Core.Dtos.Response;

namespace be_artwork_sharing_platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly ApplicationDbContext _context;

        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager, IEmailSender emailSender, ApplicationDbContext context)
        {
            _authService = authService;
            _userManager = userManager;
            _emailSender = emailSender;
            _context = context;
        }

        [HttpPost]
        [Route("seed-roles")]
        public async Task<IActionResult> SeedRoles()
        {
            var seedRoles = await _authService.SeedRoleAsync();
            return StatusCode(seedRoles.StatusCode, seedRoles.Message);
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var registerResult = await _authService.RegisterAsync(registerDto);
            return StatusCode(registerResult.StatusCode, registerResult.Message);
        }

        //Route -> Login
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<LoginServiceResponceDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var login = await _authService.LoginAsync(loginDto);
                if (login is null)
                {
                    return NotFound("Username or Password incorrect");
                }
                else
                {
                    var checkIsActive = _authService.GetStatusUser(loginDto.UserName);
                    if (checkIsActive is true)
                    {
                        return Ok(login);
                    }
                    return BadRequest("Your account have been lock");
                }
            }
                
            catch
            {
                return BadRequest("Login Failed");
            }
        }

        [HttpPost]
        [Route("me")]
        public async Task<ActionResult<LoginServiceResponceDto>> Me([FromBody] MeDto meDto)
        {
            try
            {
                var me = await _authService.MeAsync(meDto);
                if (me is not null)
                {
                    return Ok(me);
                }
                else
                {
                    return Unauthorized("InvalidToken");
                }
            }
            catch (Exception)
            {
                return Unauthorized("InvalidToken");
            }
        }

        [HttpPost]
        [Route("send-password-reset-code")]
        public async Task<IActionResult> SendPasswordResetCode(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email should not be empty");
            }
            var user = await _userManager.FindByEmailAsync(email);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            int otp = RandomNumberGenerator.Generate(100000, 999999);

            var resetPassword = new ResetPassword()
            {
                Email = email,
                OTP = otp.ToString(),
                Token = token,
                User_Id = user.Id,
                InsertDateTimeUTC = DateTime.UtcNow
            };
            await _context.ResetPasswords.AddAsync(resetPassword);
            await _context.SaveChangesAsync();

            await be_project_swp.Core.Services.EmailService.SendEmailAsync(email, "Reset Password OTP", "Hello " + email + "<br><br>Please find the reset password token bellow<br><br><b>" + otp + "<b><br><br>Thanks<br>ArtworkSharingPlatform.com");
            return Ok("Token sent successfully in email");
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(string email, string otp, ResetPasswordModel resetPasswordModel)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(resetPasswordModel.Password))
            {
                return BadRequest("Email $ New Password should not be empty");
            }
            var user = await _userManager.FindByEmailAsync(email);
            var resetPassworDetail = await _context.ResetPasswords
                .Where(rp => rp.OTP == otp && rp.User_Id == user.Id)
                .OrderByDescending(rp => rp.InsertDateTimeUTC)
                .FirstOrDefaultAsync();
            var expirationDateTimeUtc = resetPassworDetail.InsertDateTimeUTC.AddMinutes(15);
            if (expirationDateTimeUtc < DateTime.UtcNow)
            {
                return BadRequest("OTP is expired, please generate the new OTP");
            }
            var res = await _userManager.ResetPasswordAsync(user, resetPassworDetail.Token, resetPasswordModel.Password);
            if (!res.Succeeded)
            {
                return BadRequest();
            }
            return Ok();
        }

        /*        [HttpGet]
        [Route("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if(user != null)
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if(result.Succeeded)
                {
                    return StatusCode(StatusCodes.Status200OK,
                        new Response { Status = "Success", Message = "Email Verified successfully" });
                }
            }
            return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = "This user does not exist" });
        }*/

        /*[HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([Required] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var link = Url.Action(nameof(ResetPassword), "Authorization", new { token, email = user.Email }, Request.Scheme);
                var message = new Message(new string[] { user.Email! }, "Forgot Password Link", link!);
                _emailSender.SendEmail(message);
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = $"Password change request is sent on Email {user.Email} Successfully. Please Open your email & click the link" });
            }
            return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Error", Message = $"Could not send link to email, please try again." });
        }

        [HttpGet]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(string token, string email)
        {
            var model = new ResetPassword { Token = token, Email = email };
            return Ok(new
            {
                model
            });
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPassword resetPassword)
        {
            var user = await _userManager.FindByEmailAsync(resetPassword.Email);
            if (user != null)
            {
                var resetPasswordResult = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
                if (!resetPasswordResult.Succeeded)
                {
                    foreach (var error in resetPasswordResult.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return Ok(ModelState);
                }
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = $"Password has been changed" });
            }
            return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Error", Message = $"Could not send link to email, please try again." });
        }

        [HttpGet]
        [Route("test-email")]
        public IActionResult TestEmail()
        {
            var message = new Message(new string[]
            { "ungcamtuankiet20020713@gmail.com" }, "Test", "<h1>Subcribe to mine chanel");
            _emailSender.SendEmail(message);
            return StatusCode(StatusCodes.Status200OK,
                        new Response { Status = "Success", Message = "Email Verified successfully" });
        }*/
    }
}
