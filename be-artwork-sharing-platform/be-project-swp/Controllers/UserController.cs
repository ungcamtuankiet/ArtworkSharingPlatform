using be_artwork_sharing_platform.Core.Constancs;
using be_artwork_sharing_platform.Core.Dtos.User;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using be_artwork_sharing_platform.Core.Dtos.Auth;
using Microsoft.AspNetCore.Identity;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.DbContext;
using be_project_swp.Core.Dtos.Response;


namespace be_artwork_sharing_platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogService _logService;
        private readonly IUserService _userService;
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;

        public UserController(IAuthService authService, ILogService logService, IUserService userService, IConfiguration config, UserManager<ApplicationUser> userManager, ApplicationDbContext context, IEmailSender emailSender)
        {
            _authService = authService;
            _logService = logService;
            _userService = userService;
            _config = config;
            _userManager = userManager;
            _context = context;
            _emailSender = emailSender;
        }

        //Route -> List of all users with details
        [HttpGet]
        [Route("users")]
        public async Task<ActionResult<IEnumerable<UserInfoResult>>> GetUsersList()
        {
            var usersList = await _userService.GetUserListAsync();
            return Ok(usersList);
        }

        //Route -> Get User by Username
        [HttpGet]
        [Route("users/{userName}")]
        public async Task<ActionResult<UserInfoResult>> GetUserDetailByUserName([FromRoute] string userName)
        {
            var user = await _userService.GetUserDetailsByUserNameAsyncs(userName);
            if (user is not null)
            {
                return Ok(user);
            }
            else
            {
                return NotFound("UseName not found");
            }
        }

        //Route -> Get list of usernames for send message
        [HttpGet]
        [Route("usernames")]
        public async Task<ActionResult<IEnumerable<string>>> GetUserNameList()
        {
            var usernames = await _userService.GetUsernameListAsync();
            return Ok(usernames);
        }

        [HttpPut]
        [Route("update-information")]
        [Authorize]
        public async Task<ActionResult<GeneralServiceResponseDto>> UpdateInformation(UpdateInformation updateUser)
        {
            var isExistNickName = _context.Users.FirstOrDefault(u => u.NickName ==  updateUser.NickName);
            string userName = HttpContext.User.Identity.Name;
            string userId = await _authService.GetCurrentUserId(userName);
            var result = await _userService.UpdateInformation(updateUser, userId);
            await _logService.SaveNewLog(userName, "Update Information User");
            return StatusCode(result.StatusCode, result.Message);
        }

        [HttpPut]
        [Route("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePassword changePassword)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                string PasswordCurrent = await _authService.GetPasswordCurrentUserName(userName);
                bool checkOldPassword = CheckPassword.VerifyPassword(PasswordCurrent, changePassword.OldPassword);
                if (checkOldPassword)
                {
                    if (changePassword.NewPassword != changePassword.ConfirmNewPassword)
                    {
                        return BadRequest(new GeneralServiceResponseDto()
                        {
                            IsSucceed = false,
                            StatusCode = 400,
                            Message = "ConfirmPassword not match NewPassword"
                        });
                    }
                    else if (changePassword.OldPassword == changePassword.NewPassword)
                    {
                        return BadRequest(new GeneralServiceResponseDto()
                        {
                            IsSucceed = false,
                            StatusCode = 400,
                            Message = "New Password cannot be the same as the Old Password"
                        });
                    }
                    _userService.ChangePassword(changePassword, userId);
                    _logService.SaveNewLog(userName, "Change Password Successfully");
                    return Ok(new GeneralServiceResponseDto()
                    {
                        IsSucceed = true,
                        StatusCode = 200,
                        Message = "Change Password Successfully"
                    });
                }
                else
                {
                    return BadRequest(new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 400,
                        Message = "OldPassword incorrect"
                    });
                }
            }
            catch
            {
                return BadRequest("Error to change password");
            }
        }
    }
}
