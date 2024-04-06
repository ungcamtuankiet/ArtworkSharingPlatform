using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.Report;
using be_project_swp.Core.Dtos.Response;
using be_project_swp.Core.Entities;
using be_project_swp.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace be_project_swp.Core.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public ReportService(ApplicationDbContext context, ILogService logService = null)
        {
            _context = context;
            _logService = logService;
        }

        public async Task<GeneralServiceResponseDto> CreateReport(CreateReport createReport, string user_Id, string nickName_Reporter, string nickName_Accused)
        {
            var checkNickName_Accused = await _context.Users.FirstOrDefaultAsync(u => u.NickName == nickName_Accused);
            var report = new Report()
            {
                User_Id = user_Id,
                NickName_Reporter = nickName_Reporter,
                NickName_Accused = nickName_Accused,
                Reason = createReport.Reason,
            };
            if (report.NickName_Reporter == nickName_Accused)
            {
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 400,
                    Message = "You can not report you"
                };
            }
            else
            {
                if (checkNickName_Accused is null)
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 404,
                        Message = "Accused does not exist"
                    };
                }
                else
                {
                    await _context.Reports.AddAsync(report);
                    await _context.SaveChangesAsync();
                    await _logService.SaveNewLog(user_Id, "Send Report");
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = true,
                        StatusCode = 200,
                        Message = "Report successfully"
                    };
                }
            }
        }
    }
}
