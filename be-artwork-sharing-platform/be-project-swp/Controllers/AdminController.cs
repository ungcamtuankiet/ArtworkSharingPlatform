using AutoMapper;
using be_artwork_sharing_platform.Core.Constancs;
using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.Artwork;
using be_artwork_sharing_platform.Core.Dtos.User;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using be_artwork_sharing_platform.Core.Services;
using be_project_swp.Core.Dtos.Artwork;
using be_project_swp.Core.Dtos.RequestOrder;
using be_project_swp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;
using System.Net.WebSockets;

namespace be_project_swp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IArtworkService _artworkService;
        private readonly IAuthService _authService;
        private readonly ILogService _logService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IOrderService _orderService;

        public AdminController(IArtworkService artworkService, IAuthService authService, ILogService logService, IMapper mapper, IUserService userService, IOrderService orderService)
        {
            _artworkService = artworkService;
            _authService = authService;
            _logService = logService;
            _mapper = mapper;
            _userService = userService;
            _orderService = orderService;
        }

        [HttpGet]
        [Route("get-artwork-for-admin")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<IActionResult> GetArtworkForAdmin(string? getBy)
        {
            var artworks = await _artworkService.GetArtworkForAdmin(getBy);
            if (artworks is null)
                return NotFound("Artworks not available");
            return Ok(_mapper.Map<List<GetArtworkByUserId>>(artworks));
        }

        [HttpPatch]
        [Route("accept-artwork")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<IActionResult> AcceptArtwork(long id)
        {
            try
            {
                var accpetArtwork = new AcceptArtwork();
                string userName = HttpContext.User.Identity.Name;
                var checkIsDelete = _artworkService.GetStatusIsDeleteArtwork(id);
                if (checkIsDelete is true)
                {
                    return BadRequest("Artwork was refuse so you can accept this artwork");
                }
                await _artworkService.AcceptArtwork(id, accpetArtwork, userName);
                return Ok("Accept Artwork Successfully");
            }
            catch
            {
                return BadRequest("Something went wrong");
            }
        }

        [HttpPatch]
        [Route("refuse-artwork")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<IActionResult> RefuseArtwork(long id, RefuseArtwork refuseArtwork)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                var checkIsActive = _artworkService.GetStatusIsActiveArtwork(id);
                if (checkIsActive is true)
                {
                    return BadRequest("Artwork was accpet so you can refuse this artwork");
                }
                await _artworkService.RefuseArtwork(id, refuseArtwork, userName);
                return Ok("Refuse Artwork Successfully");
            }
            catch
            {
                return BadRequest("Something went wrong");
            }
        }

        [HttpPatch]
        [Route("update-status-user")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<IActionResult> UpdateStatusUser(UpdateStatusUser updateUser, string user_Id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                if (userId == user_Id)
                {
                    return BadRequest("You can not update status of you");
                }
                await _userService.UpdateUser(updateUser, user_Id, userName);
                return Ok("Update Status User Successfully");
            }
            catch
            {
                return BadRequest("Update Status User Failed");
            }
        }

        [HttpGet]
        [Route("get-creator-list")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<ActionResult<UserInfoResult>> GetCreatorList()
        {
            try
            {
                var result = await _userService.GetCreatorUserListAsync();
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("get-user-revenue")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<IActionResult> GetUserRevenue()
        {
            try
            {
                var result = await _orderService.GetUserRevenue();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
