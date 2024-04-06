using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.Log;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace be_artwork_sharing_platform.Core.Services
{
    public class LogService : ILogService
    {
        private readonly ApplicationDbContext _context;

        public LogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SaveNewLog(string UserName, string Description)
        {
            var newLog = new Log()
            {
                UserName = UserName,
                Description = Description
            };

            await _context.AddAsync(newLog);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<GetLogDto>> GetLogsAsync()
        {
            var logs = await _context.Logs
                .Select(q => new GetLogDto
                {
                    CreatedAt = q.CreatedAt,
                    UserName = q.UserName,
                    Description = q.Description
                })
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            return logs;
        }

        public async Task<IEnumerable<GetLogDto>> GetMyLogAsync(ClaimsPrincipal User)
        {
            var logs = await _context.Logs
                .Where(q => q.UserName == User.Identity.Name)
                .Select(q => new GetLogDto
                {
                    CreatedAt = q.CreatedAt,
                    UserName = q.UserName,
                    Description = q.Description
                })
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            return logs;
        }
    }
}
