using be_artwork_sharing_platform.Core.Constancs;
using System.ComponentModel.DataAnnotations;

namespace be_artwork_sharing_platform.Core.Dtos.User
{
    public class UpdateInformation
    {
        [Required]
        [StringLength(30)]
        public string NickName { get; set; }
        [Required]
        [StringLength(50)]
        [RegularExpression(RegexConst.EMAIL, ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        public string Address { get; set; } = string.Empty;
        [Required]
        [StringLength(15, ErrorMessage = "Phone number must be 0-15 characters")]
        [RegularExpression(RegexConst.PHONE_NUMBER, ErrorMessage = "Invalid phone number")]
        public string PhoneNo { get; set; } = string.Empty;
    }
}
