using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.User;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net;
using be_project_swp.Core.Dtos.Response;
using be_artwork_sharing_platform.Core.Constancs;

namespace be_artwork_sharing_platform.Core.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public UserService(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ILogService logService)
        {
            _userManager = userManager;
            _context = context;
            _logService = logService;
        }

        public async Task<GeneralServiceResponseDto> UpdateInformation(UpdateInformation updateUser, string userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id.Equals(userId));
            if (user is null)
            {
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = "User not found"
                };
            }
            if (!string.IsNullOrEmpty(updateUser.NickName) && updateUser.NickName != user.NickName)
            {
                var isExistNickName = _context.Users.FirstOrDefault(u => u.NickName == updateUser.NickName);
                if (isExistNickName is not null)
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 400,
                        Message = "NickName Already Exist"
                    };
                }
                user.NickName = updateUser.NickName;
            }

            if (!string.IsNullOrEmpty(updateUser.Email) && updateUser.Email != user.Email)
            {
                var isExistEmail = await _userManager.FindByEmailAsync(updateUser.Email);
                if (isExistEmail is not null)
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 400,
                        Message = "Email Already Exist"
                    };
                }
                user.Email = updateUser.Email;
            }

            if (!string.IsNullOrEmpty(updateUser.Address))
                user.Address = updateUser.Address;

            if (!string.IsNullOrEmpty(updateUser.PhoneNo))
                user.PhoneNumber = updateUser.PhoneNo;

            _context.Update(user);
            _context.SaveChanges();

            return new GeneralServiceResponseDto()
            {
                IsSucceed = true,
                StatusCode = 200,
                Message = "User information updated successfully"
            };
        }

        public async Task UpdateUser(UpdateStatusUser updateStatusUser, string userId, string userName)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id.Equals(userId));

            if (user is not null)
            {
                await _logService.SaveNewLog(userName, "Update Status User");
                user.IsActive = updateStatusUser.IsActive;  
            }
            _context.Update(user);
            _context.SaveChanges();
        }

        public void ChangePassword(ChangePassword changePassword, string userID)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id.Equals(userID));
            if (user is not null)
            {
                user.PasswordHash = CheckPassword.HashPassword(changePassword.NewPassword);
            }
            _context.Update(user);
            _context.SaveChanges();
        }

        public async Task<IEnumerable<UserInfoResult>> GetCreatorUserListAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            List<UserInfoResult> creatorUsers = new List<UserInfoResult>();

            foreach (var user in users)
            {
                var userInfo = GeneralUserInfoObject(user);
                if (userInfo != null) // Only add if user is a "CREATOR"
                {
                    creatorUsers.Add(userInfo);
                }
            }
            return creatorUsers;
        }

        public async Task<IEnumerable<UserInfoResult>> GetUserListAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            List<UserInfoResult> userInfoResults = new List<UserInfoResult>();

            foreach (var user in users)
            {
                var userInfo = GeneralUserInfoObject(user);
                userInfoResults.Add(userInfo);
            }
            return userInfoResults;
        }
        public async Task<UserInfoResult?> GetUserDetailsByUserNameAsyncs(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user is null) return null;

            var userInfo = GeneralUserInfoObject(user);
            return userInfo;
        }

        public async Task<IEnumerable<string>> GetUsernameListAsync()
        {
            var userNames = await _userManager.Users
                .Select(q => q.UserName)
                .ToListAsync();
            return userNames;
        }

        //GeneralUserInfoObject
        private UserInfoResult GeneralUserInfoObject(ApplicationUser user)
        {
            var roles = _userManager.GetRolesAsync(user).Result;
            // Check if user has "CREATOR" role
            if (roles.Contains(StaticUserRole.CREATOR))
            {
                return new UserInfoResult()
                {
                    Id = user.Id,
                    NickName = user.NickName,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    CreatedAt = user.CreatedAt,
                    Roles = roles
                };
            }
            else
            {
                return null;
            }
        }
    }
}

