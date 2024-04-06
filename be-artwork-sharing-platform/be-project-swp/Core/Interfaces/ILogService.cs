using be_artwork_sharing_platform.Core.Dtos.Log;
using System.Security.Claims;

namespace be_artwork_sharing_platform.Core.Interfaces
{
    public interface ILogService
    {
        Task SaveNewLog(string UserName, string Description);
        Task<IEnumerable<GetLogDto>> GetLogsAsync();
        Task<IEnumerable<GetLogDto>> GetMyLogAsync(ClaimsPrincipal User);
    }
}
