using be_artwork_sharing_platform.Core.Entities;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;
using PasswordVerificationResult = Microsoft.AspNetCore.Identity.PasswordVerificationResult;

namespace be_artwork_sharing_platform.Core.Dtos.User
{
    public class CheckPassword
    {
        public static bool VerifyPassword(string hashedPassword, string passwordToCheck)
        {
            var passwordHasher = new PasswordHasher<ApplicationUser>();

            // Kiểm tra xem mật khẩu có khớp với mật khẩu băm không
            var result = passwordHasher.VerifyHashedPassword(null, hashedPassword, passwordToCheck);

            return result == PasswordVerificationResult.Success;
        }

        public static string HashPassword(string password)
        {
            var passwordHasher = new PasswordHasher<ApplicationUser>();

            // Băm mật khẩu
            string hashedPassword = passwordHasher.HashPassword(null, password);

            return hashedPassword;
        }
    }
}
