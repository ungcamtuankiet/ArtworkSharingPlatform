using be_artwork_sharing_platform.Core.Constancs;
using System.ComponentModel.DataAnnotations;

namespace be_artwork_sharing_platform.Core.Dtos.RequestOrder
{
    public class SendRequest
    {
        [Required]
        [StringLength(30)]
        [RegularExpression(RegexConst.EMAIL, ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        [Required]
        [StringLength(15, ErrorMessage = "Phone number must be 0-15 characters")]
        [RegularExpression(RegexConst.PHONE_NUMBER, ErrorMessage = "Invalid phone number")]
        public string PhoneNumber { get; set; }
        [Required]
        public string Text { get; set; }
    }
}
