using be_project_swp.Core.Dtos.Report;
using be_project_swp.Core.Dtos.Response;

namespace be_project_swp.Core.Interfaces
{
    public interface IReportService
    {
        Task<GeneralServiceResponseDto> CreateReport(CreateReport createReport, string user_Id, string nickName_Reporter, string nickName_Accused);
    }
}
