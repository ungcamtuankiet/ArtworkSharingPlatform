using be_artwork_sharing_platform.Core.Constancs;
using System.ComponentModel.DataAnnotations;

namespace be_artwork_sharing_platform.Core.Dtos.User
{
    public class ChangePassword
    {
        public string OldPassword { get; set; }
        [Required]
        [StringLength(20, ErrorMessage = "Password must be at least 8 characters and maximum 20 characters", MinimumLength = 8)]
        [RegularExpression(RegexConst.PASSWORD, ErrorMessage = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character")]
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
    }
}
