using be_artwork_sharing_platform.Core.Constancs;
using System.ComponentModel.DataAnnotations;

namespace be_project_swp.Core.Dtos.Auth;
public class ForgetPassword
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}

public class ResetPasswordModel
{
    [Required]
    [StringLength(20, ErrorMessage = "Password must be at least 8 characters and maximum 20 characters", MinimumLength = 8)]
    [RegularExpression(RegexConst.PASSWORD, ErrorMessage = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character")]
    public string Password { get; set; } = null!;
    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; } = null!;
}