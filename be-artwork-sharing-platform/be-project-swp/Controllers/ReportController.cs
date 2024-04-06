using be_artwork_sharing_platform.Core.Constancs;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.Report;
using be_project_swp.Core.Dtos.Response;
using be_project_swp.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_project_swp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IAuthService _authService;

        public ReportController(IReportService reportService, IAuthService authService)
        {
            _reportService = reportService;
            _authService = authService;
        }

        [HttpPost]
        [Route("send-report")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> SendReport(CreateReport createReport, string nickName_Accused)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string user_Id = await _authService.GetCurrentUserId(userName);
                string nickNameCurrent = await _authService.GetCurrentNickName(userName);
                var result = await _reportService.CreateReport(createReport, user_Id, nickNameCurrent, nickName_Accused);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
