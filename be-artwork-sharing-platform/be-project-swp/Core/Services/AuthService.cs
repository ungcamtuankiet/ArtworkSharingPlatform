using be_artwork_sharing_platform.Core.Constancs;
using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.Artwork;
using be_artwork_sharing_platform.Core.Dtos.Auth;
using be_artwork_sharing_platform.Core.Dtos.User;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using be_project_swp.Core.Entities;
using be_project_swp.Core.Base;
using be_project_swp.Core.Dtos.Email;
using PayPalCheckoutSdk.Orders;
using be_project_swp.Core.Dtos.Response;

namespace be_artwork_sharing_platform.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogService _logService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogService logService, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logService = logService;
            _configuration = configuration;
            _context = context;
        }

        public async Task<GeneralServiceResponseDto> SeedRoleAsync()
        {
            bool isAdminRoleExists = await _roleManager.RoleExistsAsync(StaticUserRole.ADMIN);
            bool isCreatorRoleExists = await _roleManager.RoleExistsAsync(StaticUserRole.CREATOR);

            if (isAdminRoleExists && isCreatorRoleExists)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = true,
                    StatusCode = 200,
                    Message = "Role seeding is already done"
                };

            await _roleManager.CreateAsync(new IdentityRole(StaticUserRole.ADMIN));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRole.CREATOR));

            return new GeneralServiceResponseDto()
            {
                IsSucceed = true,
                StatusCode = 201,
                Message = "Roles seeding done Successfully"
            };
        }

        public async Task<GeneralServiceResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var isExistNickName = _context.Users.FirstOrDefault(u => u.NickName == registerDto.NickName);
            var isExistUser = await _userManager.FindByNameAsync(registerDto.UserName);
            var isExistEmail = await _userManager.FindByEmailAsync(registerDto.Email);
            if(isExistNickName is not null)
            {
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 400,
                    Message = "NickName Already Exist"
                };
            }
            if (isExistUser is not null)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 400,
                    Message = "UserName Already Exist"
                };

            if (isExistEmail is not null)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 400,
                    Message = "Email Already Exist"
                };

            ApplicationUser newUser = new ApplicationUser()
            {
                NickName = registerDto.NickName,
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNo,
                Address = registerDto.Address,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var createUserResult = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (!createUserResult.Succeeded)
            {
                var errorString = "User creation failed because: ";
                foreach(var error in createUserResult.Errors)
                {
                    errorString += " # " + error.Description;
                }
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 400,
                    Message = errorString
                };
            }

            //Add a Default Customer Role to users
            await _userManager.AddToRoleAsync(newUser, StaticUserRole.CREATOR);
            await _logService.SaveNewLog(newUser.UserName, "Register to WebSite");
            return new GeneralServiceResponseDto()
            {
                IsSucceed = true,
                StatusCode = 200,
                Message = $"Create New User Successfully"
            };
        }


        public async Task<LoginServiceResponceDto?> LoginAsync(LoginDto loginDto)
        {
            //Find User with username
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user is null)
                return null;

            //Check password of user
            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordCorrect)
                return null;

            //Return Token user and userInfo to front-end
            var newToken = await GeneralJWTTokenAsyncs(user);
            var role = await _userManager.GetRolesAsync(user);
            var userInfo = GeneralUserInfoObject(user, role);
            await _logService.SaveNewLog(user.UserName, "New Login");
            return new LoginServiceResponceDto()
            {
                NewToken = newToken,
                UserInfo = userInfo
            };
        }

/*        public async Task<GeneralServiceResponseDto> UpdateRoleAsync(ClaimsPrincipal User, UpdateRoleDto updateRoleDto)
        {
            var user = await _userManager.FindByNameAsync(updateRoleDto.UserName);
            if (user is null)
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 401,
                    Message = "Invalid UserName"
                };

            var userRoles = await _userManager.GetRolesAsync(user);
            // Just ADMIN can update roles
            //If user Admin
            if(updateRoleDto.NewRole == RoleType.CREATOR || updateRoleDto.NewRole == RoleType.CUSTOMER)
            {
                if(userRoles.Any(q => q.Equals(StaticUserRole.ADMIN)))
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 403,
                        Message = "You are not allowed to change role of this user"
                    };
                }
                else
                {
                    await _userManager.RemoveFromRolesAsync(user, userRoles);
                    await _userManager.AddToRoleAsync(user, updateRoleDto.NewRole.ToString());
                    await _logService.SaveNewLog(user.UserName, "User Roles Updated");
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = true,
                        StatusCode = 200,
                        Message = "Role updated Successfully"
                    };
                }
            }
            else return new GeneralServiceResponseDto()
            {
                IsSucceed = false,
                StatusCode = 403,
                Message = "You are not allowed to change role of this user"
            };
        }*/

        public async Task<LoginServiceResponceDto> MeAsync(MeDto meDto)
        {
            ClaimsPrincipal handler = new JwtSecurityTokenHandler().ValidateToken(meDto.Token, new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["JWT:ValidIssuer"],
                ValidAudience = _configuration["JWT:ValidAudience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]))
            }, out SecurityToken securityToken);

            string decodedUserName = handler.Claims.First(q => q.Type == ClaimTypes.Name).Value;
            if (decodedUserName is null)
                return null;

            var user = await _userManager.FindByNameAsync(decodedUserName);
            if (user is null)
                return null;

            var newToken = await GeneralJWTTokenAsyncs(user);
            var role = await _userManager.GetRolesAsync(user);
            var userInfo = GeneralUserInfoObject(user, role);
            await _logService.SaveNewLog(user.UserName, "New Token Generated");

            return new LoginServiceResponceDto()
            {
                NewToken = newToken,
                UserInfo = userInfo,
            };
        }

        //GeneralJWTTokenAsync
        private async Task<string> GeneralJWTTokenAsyncs(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("NickName", user.NickName)
            };

            foreach(var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSecret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var signingCredentials = new SigningCredentials(authSecret, SecurityAlgorithms.HmacSha256);

            var tokenObject = new JwtSecurityToken
                (
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    notBefore: DateTime.UtcNow,
                    expires: DateTime.UtcNow.AddHours(1),
                    claims: authClaims,
                    signingCredentials: signingCredentials
                );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenObject);
            return token;
        }

        public Task<ApplicationUser?> GetUserByEmailAsync(string email)
        {
            return _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<string> GetCurrentUserId(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if(user is not null)
                return user.Id;
            return null;
        }

        public async Task<string> GetCurrentUserName(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user is not null)
                return user.UserName;
            return null;
        }

        public async Task<string> GetCurrentNickName(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user is not null)
                return user.NickName;
            return null;
        }

        public async Task<string> GetCurrentNickNameByUserId(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if(user is not null)
                return user.NickName;
            return null;
        }

        public async Task<string> GetPasswordCurrentUserName(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user is not null)
                return user.PasswordHash;
            return null;
        }

        public bool GetStatusUser(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserName == username);
            if(user is not null)
            {
                return user.IsActive;
            }
            return user.IsActive;
        }

        private UserInfoResult GeneralUserInfoObject(ApplicationUser user, IList<string> roles)
        {
            return new UserInfoResult()
            {
                Id = user.Id,
                NickName = user.NickName,
                UserName = user.UserName,
                Email = user.Email,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt,
                Roles = roles
            };
        }
    }
}
